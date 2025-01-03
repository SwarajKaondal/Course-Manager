from flask import Blueprint, jsonify, request
from db import call_procedure, execute_raw_sql
from model.model import Notification, Role, Textbook, Course, Chapter, Section, ContentBlock, Image, TextBlock, Activity, Answer, Faculty

common = Blueprint('common', __name__, url_prefix='/common')

GET_COURSES_ADMIN = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID"
GET_COURSES_TA = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID JOIN Teaching_Assistant TA ON C.Course_ID = TA.Course_ID WHERE Student_ID = %s"
GET_COURSES_STUDENT = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID JOIN Enroll E ON C.Course_ID = E.Course_ID WHERE E.Student_ID = %s"
GET_COURSES_FACULTY = "SELECT C.COURSE_ID, C.TITLE, C.FACULTY, C.START_DATE, C.END_DATE, C.TYPE, AC.TOKEN, AC.Course_Capacity, C.Textbook_ID FROM COURSE C LEFT JOIN Active_Course AC ON C.Course_ID = AC.Course_ID WHERE Faculty = %s"

GET_TEXTBOOK = "SELECT Textbook_ID, Title, %s FROM Textbook WHERE Textbook_ID = %s"
GET_CHAPTER = "SELECT Chapter_ID, Chapter_Number, Title, Hidden, Created_By FROM Chapter WHERE Textbook_ID = %s"
GET_SECTION = "SELECT Section_ID, Title, Section_Number, Hidden, Created_By FROM Section WHERE Chapter_ID = %s"
GET_CONTENT_BLOCK = "SELECT Content_BLK_ID, HIDDEN, Created_By, Sequence_Number FROM Content_Block WHERE Section_ID = %s"
GET_IMAGE = "SELECT Image_ID, Path FROM Image WHERE Content_BLK_ID = %s"
GET_TEXT_BLOCK = "SELECT Text_Blk_ID, Text FROM Text_Block WHERE Content_BLK_ID = %s"
GET_ACTIVIY = "SELECT Activity_ID, Question, Question_ID, %s FROM Activity WHERE Content_BLK_ID = %s"
GET_ANSWERS = "SELECT Answer_ID, Answer_Text, Answer_Explanation, Correct FROM Answer WHERE Activity_ID = %s"
GET_FACULTY = "SELECT P.User_ID, P.First_Name, P.Last_Name, P.Email, R.Role_name, P.Role_ID FROM Person P, Person_Role R, Course C WHERE C.course_id = %s AND C.faculty = P.user_id AND P.Role_ID = R.Role_ID"

GET_ROLE = "SELECT Role_ID FROM Person WHERE User_ID = %s"
GET_ALL_TEXTBOOKS = "SELECT Textbook_ID, Title, %s FROM Textbook"
GET_ACTIVITY_ALL_TEXTBOOKS = 'SELECT Activity_ID, Question, Question_ID, %s FROM Activity WHERE Content_BLK_ID = %s'

QUERY_MAPPING = {
    1: {
        "headers": ["Textbook ID","Texbook Name", "Sections"],
        "query": "SELECT t.Textbook_ID, t.Title, Count(s.Section_ID) as Sections FROM Textbook t "+
                "INNER JOIN Chapter c ON t.Textbook_ID = c.Textbook_ID "+
                "INNER JOIN Section s ON s.Chapter_ID = c.Chapter_ID "+
                "WHERE c.chapter_number = 'chap01' "+
                "group by t.Textbook_ID;",
    },
    2: {
        "headers": ["First Name","Last Name", "Role"],
        "query": "select P.First_Name, P.Last_Name, R.Role_name from Course C " +
                "INNER JOIN Person P ON C.Faculty = P.User_ID " +
                "INNER JOIN Person_Role R ON P.Role_ID = R.Role_ID " +
                "union " +
                "SELECT Distinct P.First_Name, P.Last_Name, R.Role_name FROM Teaching_Assistant T " +
                "INNER JOIN Person P ON T.Student_ID = P.User_ID " +
                "INNER JOIN Person_Role R ON P.Role_ID = R.Role_ID;"
    },
    3: {
        "headers": ["Course ID","Faculty", "Students"],
        "query": "Select A.Course_ID, P.First_Name, Count(E.Course_ID) as Students from Active_course A " +
                    "Inner Join Course C ON A.Course_ID = C.Course_ID " +
                    "INNER JOIN Person P ON C.Faculty = P.User_ID " +
                    "INNER JOIN Person_Role R ON P.Role_ID = R.Role_ID " +
                    "Inner Join Enroll E ON C.Course_ID = E.Course_ID " +
                    "group by E.Course_ID"
    },
    4: {
        "headers": ["Course ID", "Students"],
        "query": "Select Course_ID, Count(Student_ID) as Students from Waitlist group by Course_ID order by Students desc Limit 1"
    },
    6: {
        "headers": ["Answer Text", "Answer Explanation"],
        "query": "Select AW.Answer_Text, AW.Answer_Explanation from Activity A " +
                "Inner Join Answer AW ON A.Activity_ID = AW.Activity_ID " +
                "where A.Content_BLK_ID = 2  " +
                "and A.Question_ID = 'Q2' " +
                "and AW.Correct = 0 "
    },
    7: {
        "headers": ["Textbook ID", "Textbook Name"],
        "query": "Select T.Textbook_ID, T.Title from Course C1 " +
                "Inner Join Course C2 ON C1.Textbook_ID = C2.Textbook_ID " +
                "Inner Join Textbook T ON C1.Textbook_ID = T.Textbook_ID " +
                "and C1.Type = 'ACTIVE' " +
                "and C2.Type = 'EVALUATION' " +
                "and C1.Faculty != C2.Faculty "
    },
}

def can_edit(role_id: int, created_by_role: int):
    if role_id == 1:
        return True
    if role_id == 2 and created_by_role == 2 or created_by_role == 4:
        return True
    if role_id == 4 and created_by_role == 4:
        return True
    return False

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
        textbooks = execute_raw_sql(GET_TEXTBOOK, (c.course_id, c.textbook_id,))
        for textbook in textbooks:
            textbook = Textbook(*textbook)

            # Fetch chapters in the textbook
            chapters = execute_raw_sql(GET_CHAPTER, (textbook.textbook_id,))
            for chapter in chapters:
                chapter = Chapter(*chapter)
                created_by_role = execute_raw_sql(GET_ROLE, (chapter.created_by,))
                chapter.can_edit = can_edit(user_role_id, created_by_role[0][0])

                # Fetch sections in the chapter
                sections = execute_raw_sql(GET_SECTION, (chapter.chapter_id,))
                for section in sections:
                    section = Section(*section)
                    created_by_role = execute_raw_sql(GET_ROLE, (section.created_by,))
                    section.can_edit = can_edit(user_role_id, created_by_role[0][0])

                    # Fetch content blocks in the section
                    content_blocks = execute_raw_sql(GET_CONTENT_BLOCK, (section.section_id,))
                    for content_block in content_blocks:
                        content_block = ContentBlock(*content_block)
                        created_by_role = execute_raw_sql(GET_ROLE, (content_block.created_by,))
                        content_block.can_edit = can_edit(user_role_id, created_by_role[0][0])

                        # Fetch images associated with the content block
                        images = execute_raw_sql(GET_IMAGE, (content_block.content_blk_id,))
                        for image in images:
                            image = Image(*image)
                            content_block.image.append(image)

                        # Fetch text blocks associated with the content block
                        text_blocks = execute_raw_sql(GET_TEXT_BLOCK, (content_block.content_blk_id,))
                        for text_block in text_blocks:
                            text_block = TextBlock(*text_block)
                            content_block.text_block.append(text_block)

                        # Fetch activities associated with the content block
                        activities = execute_raw_sql(GET_ACTIVIY, (c.course_id, content_block.content_blk_id,))
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

@common.route('/get_course_info', methods=['Post'])
def get_course_info():
    data = request.get_json()
    if "user_id" in data:
        user_id = data["user_id"]
    else:
        user_id = None
    response = execute_raw_sql(
        "Select C.Title, A.* from Active_course as A INNER JOIN Course C on A.Course_ID = C.Course_ID where C.Course_ID not in (select W.Course_ID from Waitlist W where W.Student_ID = %s)",
        [user_id])
    results = []
    for res in response:
        results.append(
            {
                "Title": res[0],
                "Course_Id": res[1],
                "Token": res[2],
                "Capacity": res[3],
            }
        )
    return results

@common.route('/get_textbook_info', methods=['GET'])
def get_textbook_info():
    response = execute_raw_sql("Select T.Textbook_ID, T.Title from Textbook T;")
    results = []
    for res in response:
        results.append(
            {
                "textbook_id": res[0],
                "title": res[1]
            }
        )
    return results

@common.route('/notification', methods=['POST'])
def get_notifications():
    result = call_procedure('person_notification', ['user_id'])
    notifications = []
    for row in result[0]:
        notifications.append(row[0])
    return jsonify(notifications), 200

@common.route('/get_query_data/<int:query_id>', methods=['GET'])
def get_query_data(query_id):
    results = execute_raw_sql(QUERY_MAPPING[query_id]["query"])
    response = []
    for result in results:
        obj = {}
        for i, header in enumerate(QUERY_MAPPING[query_id]["headers"]):
            obj[header] = result[i]
        response.append(obj)
    return jsonify(response), 200


@common.route('/allTextbooks', methods=['POST'])
def get_all_textbooks():
    all_textbooks = []
    user_role_id = request.get_json()['user_role_id']
    textbooks = execute_raw_sql(GET_ALL_TEXTBOOKS, ('SOMETHING',))
    print(len(textbooks))
    for textbook in textbooks:
        textbook = Textbook(*textbook)

        # Fetch chapters in the textbook
        chapters = execute_raw_sql(GET_CHAPTER, (textbook.textbook_id,))
        for chapter in chapters:
            chapter = Chapter(*chapter)
            created_by_role = execute_raw_sql(GET_ROLE, (chapter.created_by,))
            chapter.can_edit = can_edit(user_role_id, created_by_role[0][0])

            # Fetch sections in the chapter
            sections = execute_raw_sql(GET_SECTION, (chapter.chapter_id,))
            for section in sections:
                section = Section(*section)
                created_by_role = execute_raw_sql(GET_ROLE, (section.created_by,))
                section.can_edit = can_edit(user_role_id, created_by_role[0][0])

                # Fetch content blocks in the section
                content_blocks = execute_raw_sql(GET_CONTENT_BLOCK, (section.section_id,))
                for content_block in content_blocks:
                    content_block = ContentBlock(*content_block)
                    created_by_role = execute_raw_sql(GET_ROLE, (content_block.created_by,))
                    content_block.can_edit = can_edit(user_role_id, created_by_role[0][0])

                    # Fetch images associated with the content block
                    images = execute_raw_sql(GET_IMAGE, (content_block.content_blk_id,))
                    for image in images:
                        image = Image(*image)
                        content_block.image.append(image)

                    # Fetch text blocks associated with the content block
                    text_blocks = execute_raw_sql(GET_TEXT_BLOCK, (content_block.content_blk_id,))
                    for text_block in text_blocks:
                        text_block = TextBlock(*text_block)
                        content_block.text_block.append(text_block)

                    # Fetch activities associated with the content block
                    activities = execute_raw_sql(GET_ACTIVITY_ALL_TEXTBOOKS, ("SOMETHING", content_block.content_blk_id,))
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
        all_textbooks.append(textbook.to_dict())
    return jsonify(all_textbooks), 200
