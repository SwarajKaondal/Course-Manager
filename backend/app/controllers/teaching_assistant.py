from flask import Blueprint, jsonify
from db import call_procedure

teachingAssistant = Blueprint('teachingAssistant', __name__, url_prefix='/ta')

@teachingAssistant.route('/hideContent', methods=['POST'])
def update_content():
    result = call_procedure('ta_hide_content', ['content_blk_id'])
    return jsonify(result), 200

@teachingAssistant.route('/hideSection', methods=['POST'])
def update_section():
    result = call_procedure('ta_hide_section', ['section_id'])
    return jsonify(result), 200

@teachingAssistant.route('/hideChapter', methods=['POST'])
def update_chapter():
    result = call_procedure('ta_hide_chapter', ['chapter_id'])
    return jsonify(result), 200

@teachingAssistant.route('/deleteContent', methods=['POST'])
def delete_content():
    result = call_procedure('ta_delete_content', ['content_blk_id'])
    return jsonify(result), 200

@teachingAssistant.route('/deleteSection', methods=['POST'])
def delete_section():
    result = call_procedure('ta_delete_section', ['section_id'])
    return jsonify(result), 200


@teachingAssistant.route('/deleteChapter', methods=['POST'])
def delete_chapter():
    result = call_procedure('ta_delete_chapter', ['chapter_id'])
    return jsonify(result), 200
