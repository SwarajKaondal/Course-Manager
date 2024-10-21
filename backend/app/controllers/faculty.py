from flask import Blueprint, jsonify
from db import connection_pool
from flask import request

faculty = Blueprint('faculty', __name__, url_prefix='/faculty')