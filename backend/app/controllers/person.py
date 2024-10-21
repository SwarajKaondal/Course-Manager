from flask import Blueprint, jsonify
from db import connection_pool
from flask import request, abort

person = Blueprint('person', __name__, url_prefix='/person')


"""
    Input:
    {
        "user_id": "JohnDoe123
        "password": "Password"
        "role_id": 1
    }
"""
@person.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    user_id = data['user_id']
    password = data['password']
    role_id = data['role_id']
    
    query = "SELECT * FROM person WHERE User_ID = %s AND Password = %s AND Role_ID = %s"
    
    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    cursor.execute(query, (user_id, password, role_id))
    result = cursor.fetchone()
    
    if result:
        return jsonify({'message': 'Login Succesful'})
    else:
        abort(401, description=jsonify({'message': 'Login Failed'}))

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
    user_id = data['user_id']
    old_password = data['old_password']
    new_password = data['new_password']
    confirm_password = data['confirm_password']
    
    if(new_password != confirm_password):
        return jsonify({'message': 'Passwords do not match'}), 
    
    check_password_query = "SELECT Password FROM person WHERE User_ID = %s"
    
    conn = connection_pool.get_connection();
    
    cursor = conn.cursor()
    cursor.execute(check_password_query, (user_id,))
    result = cursor.fetchone()
    
    if result[0] != old_password:
        return jsonify({'message': 'Old password is incorrect'})
    
    update_password_query = "UPDATE person SET Password = %s WHERE User_ID = %s"
    
    cursor.execute(update_password_query, (new_password, user_id))
    
    return jsonify({'message': 'Success'})