from flask import Blueprint, jsonify
from db import execute_query
import mysql

admin = Blueprint('admin', __name__, url_prefix='/admin')

CREATE_FACULTY = "SELECT create_faculty(%s, %s, %s, %s, %s)"
CREATE_TEXTBOOK = "SELECT create_textbook(%s, %s, %s)"
ADD_CHAPTER = "SELECT add_chapter(%s, %s, %s, %s)"
ADD_SECTION = "SELECT add_section(%s, %s, %s, %s)"
ADD_CONTENT_BLOCK = "SELECT add_content_block(%s, %s, %s, %s)"
ADD_TEXT = "SELECT add_text(%s, %s, %s)"
ADD_PICTURE = "SELECT add_picture(%s, %s, %s)"
ADD_ACTIVITY = "SELECT add_activity(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
ADD_ACTIVE_COURSE = "SELECT add_active_course(%s, %s, %s, %s, %s, %s, %s, %s)"
ADD_EVAL_COURSE = "SELECT add_eval_course(%s, %s, %s, %s, %s, %s)"


@admin.route('/create_faculty', methods=['POST'])
def create_faculty():
    
    return execute_query(CREATE_FACULTY, 
                  ['role','first_name','last_name','email','user_password'],
                  "Faculty created successfully")


@admin.route('/create_textbook', methods=['POST'])
def create_textbook():
    
    return execute_query(CREATE_TEXTBOOK, 
                  ['role','title','course_id'],
                  "Textbook created successfully")

@admin.route('/add_chapter', methods=['POST'])
def add_chapter():
    return execute_query(ADD_CHAPTER, 
                  ['role', 'title', 'chapter_number', 'textbook_id'],
                  "Chapter added successfully")


@admin.route('/add_section', methods=['POST'])
def add_section():
    return execute_query(ADD_SECTION, 
                  ['role', 'title', 'section_number', 'chapter_id'],
                  "Section added successfully")


@admin.route('/add_content_block', methods=['POST'])
def add_content_block():
    return execute_query(ADD_CONTENT_BLOCK, 
                  ['role', 'user_id', 'sequence_number', 'section_id'],
                  "Content block added successfully")


@admin.route('/add_text', methods=['POST'])
def add_text():
    return execute_query(ADD_TEXT, 
                  ['role', 'text_str', 'content_blk_id'],
                  "Text added successfully")


@admin.route('/add_picture', methods=['POST'])
def add_picture():
    return execute_query(ADD_PICTURE, 
                  ['role', 'image_path', 'content_blk_id'],
                  "Picture added successfully")


@admin.route('/add_activity', methods=['POST'])
def add_activity():
    return execute_query(ADD_ACTIVITY, 
                  ['role', 'question', 'content_blk_id', 'ans_txt_1', 'ans_explain_1', 'correct_1', 
                   'ans_txt_2', 'ans_explain_2', 'correct_2', 'ans_txt_3', 'ans_explain_3', 'correct_3',
                   'ans_txt_4', 'ans_explain_4', 'correct_4'],
                  "Activity added successfully")


@admin.route('/add_active_course', methods=['POST'])
def add_active_course():
    return execute_query(ADD_ACTIVE_COURSE, 
                  ['role', 'course_id', 'course_name', 'faculty', 'start_date', 'end_date', 'token', 'course_cap'],
                  "Active course added successfully")


@admin.route('/add_eval_course', methods=['POST'])
def add_eval_course():
    return execute_query(ADD_EVAL_COURSE, 
                  ['role', 'course_id', 'course_name', 'faculty', 'start_date', 'end_date'],
                  "Evaluation course added successfully")

    


