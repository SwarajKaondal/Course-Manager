from flask import Blueprint, jsonify
from db import call_procedure
import mysql.connector

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
    return jsonify(result), 200