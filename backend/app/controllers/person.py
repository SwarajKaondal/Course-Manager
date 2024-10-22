from flask import Blueprint, jsonify
from db import call_procedure, execute_query
from flask import request, abort

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
    return jsonify(result), 200

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