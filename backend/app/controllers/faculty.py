from flask import Blueprint, jsonify
from db import call_procedure
from model.model import CourseList

faculty = Blueprint('faculty', __name__, url_prefix='/faculty')

@faculty.route('/students', methods=['POST'])
def get_students():
    result = call_procedure('faculty_view_students', ['course_id'])
    return jsonify(result), 200

@faculty.route('/waitlist', methods=['POST'])
def get_waitlist():
    result = call_procedure('faculty_view_worklist', ['course_id'])
    return jsonify(result), 200

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