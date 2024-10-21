from flask import Blueprint, jsonify
from db import connection_pool

faculty = Blueprint('faculty', __name__, url_prefix='/faculty')

@faculty.route('/')
def hello_world():
    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM person")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    print(str(result))
    return jsonify(result)
