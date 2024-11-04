export interface User {
  first_name: String;
  last_name: String;
  email: String;
  user_id: string;
  role: number;
  role_name: String;
}

export interface Course {
  course_id: String;
  title: String;
  faculty: User;
  start_date: Date;
  end_date: Date;
  type: String;
  token: String | undefined;
  course_capacity: number | undefined;
  textbooks: Textbook | undefined;
}

export interface Textbook {
  textbook_id: number;
  title: String;
  course_id: String;
  chapters: Chapter[] | undefined;
}

export interface Chapter {
  chapter_id: number;
  chapter_number: String;
  title: String;
  hidden: 1 | 0;
  can_edit: Boolean;
  sections: Section[];
}

export interface Section {
  section_id: number;
  title: String;
  section_number: number;
  hidden: 1 | 0;
  can_edit: Boolean;
  content_blocks: Content_block[];
}

export interface Content_block {
  content_block_id: number;
  hidden: 1 | 0;
  created_by: User;
  sequence_number: number;
  can_edit: Boolean;
  text_block: Text_block[] | undefined;
  image: Image[] | undefined;
  activity: Activity[] | undefined;
}

export interface Image {
  image_id: number;
  path: String;
}

export interface Text_block {
  text_block_id: number;
  text: String;
}

export interface Activity {
  activity_id: number;
  question_id: String;
  course_id: String;
  question: String;
  answer1: Answer;
  answer2: Answer;
  answer3: Answer;
  answer4: Answer;
  score: Score | undefined;
}

export interface Answer {
  answer_id: number;
  answer_text: String;
  answer_explanation: String;
  correct: number;
}

export interface Score {
  timestamp: Date;
  score: number;
}

export interface Waitlist {
  course_id: String;
  students: User[];
}

export interface Role {
  role: number;
  role_name: String;
}

export interface CourseInfo {
  Title: string;
  Course_Id: string;
  Token: string;
  Capacity: number;
}
