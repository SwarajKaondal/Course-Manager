-- Insert data into person_role
INSERT INTO person_role (Role_ID, Role_name) VALUES
(1, 'Admin'),
(2, 'Instructor'),
(3, 'Student'),
(4, 'Teaching Assistant');

-- Insert data into Person
INSERT INTO Person (User_ID, First_name, Last_name, Email, Password, Created_On, Role_ID) VALUES
('JaDo0923', 'Jane', 'Doe', 'jane.doe@example.com', 'password123', '2023-09-01', 2),
('JoSm0923', 'John', 'Smith', 'john.smith@example.com', 'password123', '2023-09-02', 2),
('AlJo0923', 'Alice', 'Johnson', 'alice.johnson@example.com', 'password123', '2023-09-03', 2),
('BoBr0923', 'Bob', 'Brown', 'bob.brown@example.com', 'password123', '2023-09-04', 3),
('EmWi0923', 'Emma', 'Wilson', 'emma.wilson@example.com', 'password123', '2023-09-05', 3);


-- Insert data into Course
INSERT INTO Course (Course_ID, Title, Faculty, Start_Date, End_Date, Type) VALUES
('C001', 'Introduction to Programming', 'JaDo0923', '2023-09-10', '2023-12-15', 'ACTIVE'),
('C002', 'Database Systems', 'JoSm0923', '2023-09-10', '2023-12-15', 'ACTIVE'),
('C003', 'Web Development', 'AlJo0923', '2023-09-10', '2023-12-15', 'EVALUATION');

-- Insert data into Textbook
INSERT INTO Textbook (Textbook_ID, Title, Course_ID) VALUES
(1, 'Programming Fundamentals', 'C001'),
(2, 'SQL Essentials', 'C002'),
(3, 'Web Design', 'C003');

-- Insert data into Chapter
INSERT INTO Chapter (Chapter_ID, Chapter_number, Title, Textbook_ID) VALUES
(1, 'chap01', 'Getting Started with Programming', 1),
(2, 'chap02', 'Data Structures', 1),
(3, 'chap01', 'Introduction to SQL', 2),
(4, 'chap02', 'Web Technologies', 3);

-- Insert data into Section
INSERT INTO Section (Section_ID, Title, Section_number, Chapter_ID) VALUES
(1, 'Basics', 1, 1),
(2, 'Advanced Topics', 2, 1),
(3, 'SQL Basics', 1, 3),
(4, 'HTML & CSS', 1, 4);

-- Insert data into Content_Block
INSERT INTO Content_Block (Content_BLK_ID, Hidden, Created_By, Sequence_number, Section_ID) VALUES
(1, FALSE, 1, 1, 1),
(2, FALSE, 1, 2, 3),
(3, TRUE, 2, 1, 4),
(4, FALSE, 3, 1, 2);

-- Insert data into Image
INSERT INTO Image (Image_ID, Path, Content_BLK_ID) VALUES
(1, '/images/prog_intro.jpg', 1),
(2, '/images/sql_intro.jpg', 2);

-- Insert data into Text_Block
INSERT INTO Text_Block (Text_BLK_ID, Text, Content_BLK_ID) VALUES
(1, 'This section covers the basics of programming.', 1),
(2, 'Learn SQL commands.', 2);

-- Insert data into Activity
INSERT INTO Activity (Activity_ID, Question, Content_BLK_ID) VALUES
(1, 'What is a variable?', 1),
(2, 'What is an SQL JOIN?', 2);

-- Insert data into Answer
INSERT INTO Answer (Answer_ID, Answer_Text, Answer_Explanation, Correct, Activity_ID) VALUES
(1, 'A placeholder for data', 'Variables are used to store data values.', TRUE, 1),
(2, 'Combines rows from two or more tables', 'JOINs are used to combine rows.', TRUE, 2);

-- Insert data into Active_Course
INSERT INTO Active_Course (Course_ID, Unique_Token, Course_Capacity) VALUES
('C001', 'TOKEN123', 30),
('C002', 'TOKEN456', 25);

-- Insert data into Enroll
INSERT INTO Enroll (Course_ID, Student_ID) VALUES
('C001', 'JaDo0923'),
('C002', 'JaDo0923'),
('C003', 'BoBr0923');

-- Insert data into Waitlist
INSERT INTO Waitlist (Course_ID, Student_ID) VALUES
('C002', 'JoSm0923'),
('C003', 'EmWi0923');

-- Insert data into Teaching_Assistant
INSERT INTO Teaching_Assistant (Course_ID, Student_ID) VALUES
('C001', 'BoBr0923');

-- Insert data into Notification
INSERT INTO Notification (Notification_ID, Text, User_ID) VALUES
(1, 'You have a new assignment!', 'JaDo0923'),
(2, 'Your course registration is confirmed.', 'BoBr0923');
