import logging
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.person import person
from controllers.faculty import faculty
from controllers.admin import admin

load_dotenv()

app = Flask(__name__)
CORS(app)

logging.getLogger('flask_cors').level = logging.DEBUG

app.register_blueprint(person)
app.register_blueprint(faculty)
app.register_blueprint(admin)
