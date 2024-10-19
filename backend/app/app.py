from flask import Flask
from flask import Flask,render_template, request, jsonify
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
 
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

@app.route("/")
def hello_world():
    cur = mysql.connection.cursor()
    
    cur.execute("SELECT * FROM USER_ROLE")
    rows = cur.fetchall()

    cur.close()
    
    return jsonify(rows)