from flask import Blueprint, jsonify
from db import call_procedure

teachingAssistant = Blueprint('teachingAssistant', __name__, url_prefix='/ta')

@teachingAssistant.route('/hideContent', methods=['POST'])
def update_content():
    result = call_procedure('ta_hide_content', ['content_blk_id'])
    return jsonify(result), 200

@teachingAssistant.route('/deleteContent', methods=['POST'])
def delete_content():
    result = call_procedure('ta_delete_content', ['content_blk_id'])
    return jsonify(result), 200