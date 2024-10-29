from flask import Blueprint, jsonify, request
from db import call_procedure, execute_raw_sql
from model.model import Role, Textbook, Course, Chapter, Section, ContentBlock, Image, TextBlock, Activity, Answer, Faculty

common = Blueprint('common', __name__, url_prefix='/common')

GET_COURSES_ADMIN = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID"
GET_COURSES_TA = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID JOIN Teaching_Assistant TA ON C.Course_ID = TA.Course_ID WHERE Student_ID = %s"
GET_COURSES_STUDENT = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID JOIN Enroll E ON C.Course_ID = E.Course_ID WHERE E.Student_ID = %s"
GET_COURSES_FACULTY = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID WHERE Faculty = %s"

GET_TEXTBOOK = "SELECT Textbook_ID, Title FROM Textbook WHERE Textbook_ID = %s"
GET_CHAPTER = "SELECT Chapter_ID, Chapter_Number, Title FROM Chapter WHERE Textbook_ID = %s"
GET_SECTION = "SELECT Section_ID, Title, Section_Number FROM Section WHERE Chapter_ID = %s"
GET_CONTENT_BLOCK = "SELECT Content_BLK_ID, HIDDEN, Created_By, Sequence_Number FROM Content_Block WHERE Section_ID = %s"
GET_IMAGE = "SELECT Image_ID, Path FROM Image WHERE Content_BLK_ID = %s"
GET_TEXT_BLOCK = "SELECT Text_Blk_ID, Text FROM Text_Block WHERE Content_BLK_ID = %s"
GET_ACTIVIY = "SELECT Activity_ID, Question FROM Activity WHERE Content_BLK_ID = %s"
GET_ANSWERS = "SELECT Answer_ID, Answer_Text, Answer_Explanation, Correct FROM Answer WHERE Activity_ID = %s"
GET_FACULTY = "SELECT P.User_ID, P.First_Name, P.Last_Name, P.Email, R.Role_name, P.Role_ID FROM Person P, Person_Role R, Course C WHERE C.course_id = %s AND C.faculty = P.user_id AND P.Role_ID = R.Role_ID"


@common.route('/roles', methods=['GET'])
def get_roles():
    result = call_procedure('fetch_roles', [])
    roles = []
    for row in result[0]:
        roles.append(Role(*row).to_dict())
    return jsonify(roles), 200


@common.route('/course', methods=['POST'])
def get_courses():
    data = request.get_json()
    user_role_id = data['role_id']
    course_list = []
    courses = []

    if user_role_id == 1:
        courses = execute_raw_sql(GET_COURSES_ADMIN)
    elif user_role_id == 2:
        courses = execute_raw_sql(GET_COURSES_FACULTY, (data['user_id'],))
    elif user_role_id == 3:
        courses = execute_raw_sql(GET_COURSES_STUDENT, (data['user_id'],))
    elif user_role_id == 4:
        courses = execute_raw_sql(GET_COURSES_TA, (data['user_id'],))
    # Fetch courses for the user

    for course in courses:
        c = Course(*course)

        faculty = execute_raw_sql(GET_FACULTY, (c.course_id,))
        c.faculty = Faculty(*faculty[0]) if faculty else None

        # Fetch textbooks related to the course
        textbooks = execute_raw_sql(GET_TEXTBOOK, (c.textbook_id,))
        for textbook in textbooks:
            textbook = Textbook(*textbook)

            # Fetch chapters in the textbook
            chapters = execute_raw_sql(GET_CHAPTER, (textbook.textbook_id,))
            for chapter in chapters:
                chapter = Chapter(*chapter)

                # Fetch sections in the chapter
                sections = execute_raw_sql(GET_SECTION, (chapter.chapter_id,))
                for section in sections:
                    section = Section(*section)

                    # Fetch content blocks in the section
                    content_blocks = execute_raw_sql(GET_CONTENT_BLOCK, (section.section_id,))
                    for content_block in content_blocks:
                        content_block = ContentBlock(*content_block)

                        # Fetch images associated with the content block
                        images = execute_raw_sql(GET_IMAGE, (content_block.content_blk_id,))
                        for image in images:
                            image = Image(*image)
                            content_block.image = image

                        # Fetch text blocks associated with the content block
                        text_blocks = execute_raw_sql(GET_TEXT_BLOCK, (content_block.content_blk_id,))
                        for text_block in text_blocks:
                            text_block = TextBlock(*text_block)
                            content_block.text_block = text_block

                        # Fetch activities associated with the content block
                        activities = execute_raw_sql(GET_ACTIVIY, (content_block.content_blk_id,))
                        for activity in activities:
                            activity = Activity(*activity)

                            # Fetch answers associated with the activity
                            answers = execute_raw_sql(GET_ANSWERS, (activity.activity_id,))
                            if len(answers) == 4:
                                activity.answer1 = Answer(*answers[0])
                                activity.answer2 = Answer(*answers[1])
                                activity.answer3 = Answer(*answers[2])
                                activity.answer4 = Answer(*answers[3])

                            content_block.activity.append(activity)

                        # Append content blocks to the section
                        section.content_blocks.append(content_block)

                    # Append sections to the chapter
                    chapter.sections.append(section)

                # Append chapters to the textbook
                textbook.chapters.append(chapter)
            # Append textbooks to the course
            c.textbook = textbook

        # Add course to the final course list
        course_list.append(c.to_dict())

    return jsonify(course_list), 200
