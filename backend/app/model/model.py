from datetime import datetime
from typing import List, Optional

class User:
    def __init__(self, user_id, first_name, last_name, email, role, role_name):
        self.first_name = first_name
        self.last_name = last_name
        self.user_id = user_id
        self.email = email
        self.role = role
        self.role_name = role_name

    def __repr__(self):
        return f"User(username={self.username}, email={self.email})"
    
    def to_dict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "user_id": self.user_id,
            "email": self.email,
            "role": self.role,
            "role_name": self.role_name
        }
    


class Role:
    def __init__(self, role_id, role_name):
        self.role_name = role_name
        self.role_id = role_id

    def __repr__(self):
        return f"Role(name={self.name})"
    
    def to_dict(self):
        return {
            "role": self.role_id,
            "role_name": self.role_name
        }
    
class Answer:
    def __init__(self, answer_id: int, answer_text: str, answer_explanation: str, correct: bool):
        self.answer_id = answer_id
        self.answer_text = answer_text
        self.answer_explanation = answer_explanation
        self.correct = correct

    def to_dict(self):
        return {
            "answer_id": self.answer_id,
            "answer_text": self.answer_text,
            "answer_explanation": self.answer_explanation,
            "correct": self.correct
        }

class Image:
    def __init__(self, image_id: int, path: str):
        self.image_id = image_id
        self.path = path

    def to_dict(self):
        return {
            "image_id": self.image_id,
            "path": self.path
        }


class Activity:
    def __init__(self, activity_id: int, question: str):
        self.activity_id = activity_id
        self.question = question
        self.answer1 = None
        self.answer2 = None
        self.answer3 = None
        self.answer4 = None

    def to_dict(self):
        return {
            "activity_id": self.activity_id,
            "question": self.question,
            "answer1": self.answer1.to_dict() if self.answer1 else None,
            "answer2": self.answer2.to_dict() if self.answer2 else None,
            "answer3": self.answer3.to_dict() if self.answer3 else None,
            "answer4": self.answer4.to_dict() if self.answer4 else None
        }


class TextBlock:
    def __init__(self, text_block_id: int, text: str):
        self.text_block_id = text_block_id
        self.text = text

    def to_dict(self):
        return {
            "text_block_id": self.text_block_id,
            "text": self.text
        }


class ContentBlock:
    def __init__(self, content_block_id: int, hidden: bool, created_by: dict, sequence_number: int):
        self.content_blk_id = content_block_id
        self.hidden = hidden
        self.created_by = created_by
        self.sequence_number = sequence_number
        self.text_block: Optional[TextBlock] = None
        self.image: Optional[Image] = None
        self.activity: Optional[Activity] = None

    def to_dict(self):
        return {
            "content_block_id": self.content_blk_id,
            "hidden": self.hidden,
            "created_by": self.created_by,
            "sequence_number": self.sequence_number,
            "text_block": self.text_block.to_dict() if self.text_block else None,
            "image": self.image.to_dict() if self.image else None,
            "activity": self.activity.to_dict() if self.activity else None
        }


class Section:
    def __init__(self, section_id: int, title: str, section_number: int):
        self.section_id = section_id
        self.title = title
        self.section_number = section_number
        self.content_blocks: List[ContentBlock] = []

    def to_dict(self):
        return {
            "section_id": self.section_id,
            "title": self.title,
            "section_number": self.section_number,
            "content_blocks": [block.to_dict() for block in self.content_blocks]
        }


class Chapter:
    def __init__(self, chapter_id: int, chapter_number: str, title: str):
        self.chapter_id = chapter_id
        self.chapter_number = chapter_number
        self.title = title
        self.sections: List[Section] = []

    def to_dict(self):
        return {
            "chapter_id": self.chapter_id,
            "chapter_number": self.chapter_number,
            "title": self.title,
            "sections": [section.to_dict() for section in self.sections]
        }


class Textbook:
    def __init__(self, textbook_id: int, title: str):
        self.textbook_id = textbook_id
        self.title = title
        self.chapters: List[Chapter] = []

    def to_dict(self):
        return {
            "textbook_id": self.textbook_id,
            "title": self.title,
            "chapters": [chapter.to_dict() for chapter in self.chapters]
        }


class Faculty:
    def __init__(self, user_id: str, first_name: str, last_name: str, email: str, role_name: str, role: int):
        self.user_id = user_id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role_name = role_name
        self.role = role

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role_name": self.role_name,
            "role": self.role
        }


class Course:
    def __init__(self, course_id: str, title: str, faculty: Faculty, start_date: datetime, end_date: datetime, type: str, token: str, course_capacity: int):
        self.course_id = course_id
        self.title = title
        self.faculty = faculty
        self.start_date = start_date
        self.end_date = end_date
        self.type = type
        self.token = token
        self.course_capacity = course_capacity
        self.textbooks: List[Textbook] = []
        

    def to_dict(self):
        return {
            "course_id": self.course_id,
            "title": self.title,
            "faculty": self.faculty.to_dict(),
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "type": self.type,
            "token": self.token,
            "course_capacity": self.course_capacity,
            "textbooks": [textbook.to_dict() for textbook in self.textbooks]
        }


class CourseList:
    def __init__(self, course_id : str, title: str):
        self.course_id = course_id
        self.title = title

    def to_dict(self):
        return {
            "course_id": self.course_id,
            "title": self.title
        }