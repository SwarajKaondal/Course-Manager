from flask import Flask
from flask import Flask,render_template, request, jsonify
import mysql.connector
from dotenv import load_dotenv
from mysql.connector import errorcode
import os

load_dotenv()

app = Flask(__name__)

config = {
  'user': os.getenv("MYSQL_USER"),
  'password': os.getenv("MYSQL_PASSWORD"),
  'host': os.getenv("MYSQL_HOST"),
  'database': os.getenv("MYSQL_DATABASE"),
  'raise_on_warnings': True
}

@app.route("/")
def hello_world():
    cnx = mysql.connector.connect(**config)

    if cnx and cnx.is_connected():
        with cnx.cursor() as cursor:
            cursor.execute("SELECT * FROM person_role")
            rows = cursor.fetchall()
            for row in rows:
                print(row)
    cnx.close()
        
    
    return 'Hello, World!'