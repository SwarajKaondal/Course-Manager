from flask import Blueprint, jsonify
from flask_cors import cross_origin
from db import call_procedure, execute_query
from flask import request, abort
from model.model import User

person = Blueprint('person', __name__, url_prefix='/person')

CHANGE_PASSWORD = "SELECT person_change_password(%s, %s, %s)"


"""
    Input:
    {
        "user_id": "JohnDoe123
        "password": "Password"
    }
"""
@person.route('/login', methods=['POST'])
def handle_login():
    result = call_procedure('person_login', ['user_id', 'password'])
    u = User(*result[0][0])
    return jsonify(u.to_dict()), 200

"""
    Input:
    {
        "user_id": "JohnDoe123",
        "old_password": "OldPass",
        "new_password": "NewPass"
        "confirm_password": "NewPass",
    }
"""
@person.route('/password', methods=['POST'])
def handle_password_change():
    data = request.get_json()
    if data['new_password'] != data['confirm_password']:
        abort(400, description="New password and confirm password do not match.")
    return execute_query(CHANGE_PASSWORD, ['user_id', 'old_password', 'new_password'], "Password changed successfully")

@person.route('/enroll', methods=['POST'])
def handle_enroll_student():
    result = call_procedure('person_add_student', ['first_name', 'last_name', 'email', 'course_token'])
    return jsonify(result), 200
