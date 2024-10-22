from flask import Flask
from dotenv import load_dotenv
from db import connection_pool
from controllers.person import person
from controllers.faculty import faculty
from controllers.admin import admin

load_dotenv()

app = Flask(__name__)

app.register_blueprint(person)
app.register_blueprint(faculty)
app.register_blueprint(admin)