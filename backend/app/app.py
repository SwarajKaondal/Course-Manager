from flask import Flask
from dotenv import load_dotenv
from db import connection_pool
from controllers.faculty import faculty

load_dotenv()

app = Flask(__name__)

app.register_blueprint(faculty)