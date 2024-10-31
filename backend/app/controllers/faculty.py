from flask import Blueprint, jsonify, request
from db import call_procedure
from model.model import CourseList, Person, Waitlist

faculty = Blueprint('faculty', __name__, url_prefix='/faculty')

@faculty.route('/students', methods=['POST'])
def get_students():
    result = call_procedure('faculty_view_students', ['course_id'])
    students = []
    for row in result[0]:
        students.append(Person(*row).to_dict())
    return jsonify(students), 200

@faculty.route('/waitlist', methods=['POST'])
def get_waitlist():
    results = call_procedure('faculty_view_worklist', ['course_id'])
    waitlist = Waitlist(request.get_json()['course_id'])
    for result in results[0]:
        waitlist.students.append(Person(*result))
    return jsonify(waitlist.to_dict()), 200

@faculty.route('/approve', methods=['POST'])
def approve_waitlist():
    result = call_procedure('faculty_approve_student', ['course_id', 'student_id'])
    return jsonify(result), 200

@faculty.route('/courses', methods=['POST'])
def get_courses():
    result = call_procedure('faculty_get_courses', ['user_id'])
    course_list = []
    for row in result[0]:
        print(*row)
        course_list.append(CourseList(*row).to_dict())
    return jsonify(course_list), 200

@faculty.route('/ta', methods=['POST'])
def add_ta():
    result = call_procedure('faculty_add_ta', ['user_role_id', 'first_name', 'last_name', 'email', 'default_password','course_id'])
    return jsonify(result), 200
