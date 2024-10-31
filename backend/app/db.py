from mysql.connector import pooling
import os
from flask import request, jsonify, abort
import mysql.connector


config = {
  'user': os.getenv("MYSQL_USER"),
  'password': os.getenv("MYSQL_PASSWORD"),
  'host': os.getenv("MYSQL_HOST"),
  'database': os.getenv("MYSQL_DATABASE"),
  'raise_on_warnings': True
}

connection_pool = pooling.MySQLConnectionPool(pool_name="pool",pool_size=10,**config)

def get_params(needed_params):
    data = request.get_json()
    param_vals = []
    for param in needed_params:
        val = data.get(param)
        if val is None:
            abort(400, description=f"Missing required field: {param}")
        param_vals.append(val)
    return tuple(param_vals)

def call_procedure(procedure, params):
    if params:
        params = get_params(params)  # Get parameters from the request
    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc(procedure, params)
        result = []
        for res in cursor.stored_results():
            result.append(res.fetchall())
        conn.commit()
        return result
    except mysql.connector.Error as err:
      abort(400, description=f"Database error: {str(err)}")
    except Exception as err:
      abort(400, description=f"Error: {str(err)}")
    finally:
      cursor.close()
      conn.close()

def call_procedure_with_params(procedure, params):
    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc(procedure, params)
        result = []
        for res in cursor.stored_results():
            conn.commit()
            result.append(res.fetchall())
        return result
    except mysql.connector.Error as err:
      abort(400, description=f"Database error: {str(err)}")
    except Exception as err:
      abort(400, description=f"Error: {str(err)}")
    finally:
      cursor.close()
      conn.close()

def execute_raw_sql(query, params = None):
    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    try:
        if params is None:
            cursor.execute(query)
        else:
            cursor.execute(query, params)
        result = cursor.fetchall()
        conn.commit()
        return result
    except mysql.connector.Error as err:
        abort(400, description=f"Database error: {str(err)}")
    except Exception as err:
        abort(400, description=f"Error: {str(err)}")
    finally:
        cursor.close()
        conn.close()

def execute_query(query, params, success_msg):
    data = request.get_json()
    param_vals = ()
    for param in params:
        val = data.get(param)
        if val == None:
            abort(400, description="Missing required fields")
        param_vals += (val,)

    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, param_vals)
        result = cursor.fetchone()

        if result and result[0] == 1:
            conn.commit()
            return jsonify({'message': f'{success_msg}'}), 201

    except mysql.connector.Error as err:
        abort(500, description=f"Database error: {str(err)}")
    except Exception as err:
        abort(500, description=f"Error: {str(err)}")
    finally:
        cursor.close()
        conn.close()

def save_score(query):
    data = request.get_json()
    user_id = data.get( 'user_id')
    course_id = data.get('course_id')
    question_id = data.get('question_id')
    activity_id = data.get('activity_id')
    score = data.get('score')

    conn = connection_pool.get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, [user_id,course_id,question_id,activity_id,score])
        result = cursor.fetchone()

        if result and result[0] == 1:
            conn.commit()
            return jsonify({'message': 'Scores saved'}), 200

    except mysql.connector.Error as err:
        abort(500, description=f"Database error: {str(err)}")
    except Exception as err:
        abort(500, description=f"Error: {str(err)}")
    finally:
        cursor.close()
        conn.close()
