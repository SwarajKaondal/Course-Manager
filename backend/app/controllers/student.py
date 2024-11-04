from flask import Blueprint, jsonify

from db import call_procedure, execute_query, save_score

student = Blueprint('student', __name__, url_prefix='/student')

ENROLL_STUDENT = "SELECT enroll_student(%s, %s)"

@student.route('/enroll', methods=['POST'])
def handle_enroll_student():
    return execute_query(ENROLL_STUDENT, ['email', 'course_token'], "Successfully enrolled")


@student.route('/save_score', methods=['POST'])
def handle_save_score():
    return save_score()

@student.route('/get_score', methods=['POST'])
def handle_get_score():
    result = call_procedure("student_score",["user_id"])
    print(result)
    return jsonify({"total": result[0][0][0], "score": result[0][0][1]}), 200
    