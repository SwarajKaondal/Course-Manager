from flask import Blueprint

from backend.app.db import execute_query, save_score

student = Blueprint('student', __name__, url_prefix='/student')

ENROLL_STUDENT = "SELECT enroll_student(%s, %s)"
SAVE_SCORE = "INSERT INTO Score VALUES(%s, %s, %s, %d, current_time(), %d); "

@student.route('/enroll_student', methods=['POST'])
def handle_enroll_student():
    
    return execute_query(ENROLL_STUDENT, ['email', 'course_token'], "Successfully enrolled")


@student.route('/save_score', methods=['POST'])
def handle_save_score():
    return save_score(SAVE_SCORE)
    