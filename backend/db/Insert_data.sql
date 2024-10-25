-- Insert data into person_role
INSERT INTO person_role (Role_ID, Role_name) VALUES
(1, 'Admin'),
(2, 'Faculty'),
(3, 'Student'),
(4, 'Teaching Assistant');

-- Insert data into Person
INSERT INTO Person (User_ID, First_name, Last_name, Email, Password, Created_On, Role_ID) VALUES
('UtLo1024', 'Utraj', 'Loandal', 'utal69@example.com', 'admin', '2024-10-01', 1),
('ErPe1024', 'Eric', 'Perrig', 'ez356@example.com', 'qwdmq', '2024-10-01', 2),
('AlAr1024', 'Alice', 'Artho', 'aa23@edu.com', 'omdsws', '2024-10-02', 2),
('BoTe1024', 'Bob', 'Temple', 'bt163@template.com', 'sak+=', '2024-10-03', 2),
('LiGa1024', 'Lily', 'Gaddy', 'li123@example.edu', 'cnaos', '2024-10-04', 3),
('ArMo1024', 'Aria', 'Morrow', 'am213@example.edu', 'jwocals', '2024-10-05', 3),
('KeRh1024', 'Kellan', 'Rhodes', 'kr21@example.edu', 'camome', '2024-10-05', 3),
('SiHa1024', 'Sienna', 'Hayes', 'sh13@example.edu', 'asdqm', '2024-10-05', 3),
('FiWi1024', 'Finn', 'Wilder', 'fw23@example.edu', 'f13mas', '2024-10-05', 3),
('LeMe1024', 'Leona', 'Mercer', 'lm56@example.edu', 'ca32', '2024-10-05', 3),
('JaWi1024', 'James', 'Williams', 'jwilliams@ncsu.edu', 'jwilliams@1234', '2024-10-05', 4),
('LiAl0924', 'Lisa', 'Alberti', 'lalberti@ncsu.edu', 'lalberti&5678@', '2024-09-05', 4),
('DaJo1024', 'David', 'Johnson', 'djohnson@ncsu.edu', 'djohnson%@1122', '2024-10-05', 4),
('ElCl1024', 'Ellie', 'Clark', 'eclark@ncsu.edu', 'eclark^#3654', '2024-10-05', 4),
('JeGi0924', 'Jeff', 'Gibson', 'jgibson@ncsu.edu', 'jgibson$#9877', '2024-09-05', 4),
('KeOg1024', 'Kemafor', 'Ogan', 'kogan@ncsu.edu', 'Ko2024!rpc', '2024-10-05', 2),
('JoDo1024', 'John', 'Doe', 'john.doe@example.com', 'Jd2024!abc', '2024-10-05', 2),
('SaMi1024', 'Sarah', 'Miller', 'sarah.miller@domain.com', 'Sm#Secure2024', '2024-10-05', 2),
('DaBr1024', 'David', 'Brown', 'david.b@webmail.com', 'DbPass123!', '2024-10-05', 2),
('EmDa1024', 'Emily', 'Davis', 'emily.davis@email.com', 'Emily#2024!', '2024-10-05', 2),
('MiWi1024', 'Michael', 'Wilson', 'michael.w@service.com', 'Mw987secure', '2024-10-05', 2);


-- Insert data into Textbook
INSERT INTO Textbook (Textbook_ID, Title) VALUES
(101, 'Database Management Systems'),
(102, 'Fundamentals of Software Engineering'),
(103, 'Fundamentals of Machine Learning');

-- Insert data into Course
INSERT INTO Course (Course_ID, Title, Faculty, Start_Date, End_Date, Type, Textbook_ID) VALUES
('NCSUOganCSC440F24', 'CSC440 Database Systems', 'KeOg1024', '2024-08-15', '2024-12-15', 'ACTIVE', 101),
('NCSUOganCSC540F24', 'CSC540 Database Systems', 'KeOg1024', '2024-08-17', '2024-12-15', 'ACTIVE', 101),
('NCSUSaraCSC326F24', 'CSC326 Software Engineering', 'SaMi1024', '2024-08-23', '2024-10-23', 'ACTIVE', 102),
('NCSUJegiCSC522F24', 'CSC522 Fundamentals of Machine Learning', 'JeGi0924', '2024-08-25', '2024-12-18', 'EVALUATION', 103),
('NCSUSaraCSC326F25', 'CSC326 Software Engineering', 'SaMi1024', '2024-08-27', '2024-12-19', 'EVALUATION', 102);

-- Insert data into Chapter
INSERT INTO Chapter (Chapter_ID, Chapter_number, Hidden, Title, Textbook_ID) VALUES
(1, 'chap01', FALSE, 'Getting Started with Programming', 101),
(2, 'chap02', FALSE, 'Data Structures', 101),
(3, 'chap01', FALSE, 'Introduction to SQL', 102),
(4, 'chap02', FALSE, 'Web Technologies', 102),
(5, 'chap01', FALSE, 'Web Technologies', 103);

-- Insert data into Section
INSERT INTO Section (Section_ID, Title, Section_number, Chapter_ID, Hidden) VALUES
(1, 'Database Management Systems (DBMS) Overview', 1, 1, FALSE),
(2, 'Data Models and Schemas', 2, 1, FALSE),
(3, 'Entities, Attributes, and Relationships', 1, 2, FALSE),
(4, 'Normalization and Integrity Constraints', 2, 2, FALSE),
(5, 'History and Evolution of Software Engineering', 1, 3, FALSE),
(6, 'Key Principles of Software Engineering', 2, 3, FALSE),
(7, 'Phases of the SDLC', 1, 4, TRUE),
(8, 'Agile vs. Waterfall Models', 2, 4, FALSE),
(9, 'Overview of Machine Learning', 1, 5, TRUE),
(10, 'Supervised vs Unsupervised Learning', 2, 5, FALSE);

-- Insert data into Content_Block
INSERT INTO Content_Block (Content_BLK_ID, Hidden, Created_By, Sequence_number, Section_ID) VALUES
(1, FALSE, 'UtLo1024', 1, 1),
(2, FALSE, 'UtLo1024', 2, 2),
(3, FALSE, 'UtLo1024', 1, 3),
(4, FALSE, 'UtLo1024', 1, 4),
(5, FALSE, 'UtLo1024', 1, 5),
(6, FALSE, 'UtLo1024', 2, 6),
(7, FALSE, 'UtLo1024', 1, 7),
(8, FALSE, 'UtLo1024', 1, 8),
(9, FALSE, 'UtLo1024', 1, 9),
(10, FALSE, 'UtLo1024', 2, 10);

-- Insert data into Image
INSERT INTO Image (Image_ID, Path, Content_BLK_ID) VALUES
(1, '/images/sample.png', 4),
(2, '/images/sample2.png', 8);
	
-- Insert data into Text_Block
INSERT INTO Text_Block (Text_BLK_ID, Text, Content_BLK_ID) VALUES
(1, 'A Database Management System (DBMS) is software that enables users to efficiently create, manage, and manipulate databases. It serves as an interface between the database and end users, ensuring data is stored securely, retrieved accurately, and maintained consistently. Key features of a DBMS include data organization, transaction management, and support for multiple users accessing data concurrently.', 1),
(2, 'DBMS systems provide structured storage and ensure that data is accessible through queries using languages like SQL. They handle critical tasks such as maintaining data integrity, enforcing security protocols, and optimizing data retrieval, making them essential for both small-scale and enterprise-level applications. Examples of popular DBMS include MySQL, Oracle, and PostgreSQL.', 3),
(3, 'The history of software engineering dates back to the 1960s, when the "software crisis" highlighted the need for structured approaches to software development due to rising complexity and project failures. Over time, methodologies such as Waterfall, Agile, and DevOps evolved, transforming software engineering into a disciplined, iterative process that emphasizes efficiency, collaboration, and adaptability.', 5),
(4, 'The Software Development Life Cycle (SDLC) consists of key phases including requirements gathering, design, development, testing, deployment, and maintenance. Each phase plays a crucial role in ensuring that software is built systematically, with feedback and revisions incorporated at each step to deliver a high-quality product.', 7),
(5, 'Machine learning is a subset of artificial intelligence that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. By training algorithms on vast datasets, machine learning models can improve their accuracy over time, driving advancements in fields like healthcare, finance, and autonomous systems.', 9);

-- Insert data into Activity
INSERT INTO Activity (Activity_ID, Question_ID, Question, Content_BLK_ID) VALUES
(1, 'Q1' , 'What does a DBMS provide?', 2),
(2, 'Q2' ,'Which of these is an example of a DBMS?', 2),
(3, 'Q3' ,'What type of data does a DBMS manage?', 2),
(4, 'Q1' ,'What was the "software crisis"?', 6),
(5, 'Q2' ,'Which methodology was first introduced in software engineering?', 6),
(6, 'Q3' ,'What What challenge did early software engineering face?', 6),
(7, 'Q1' ,'What is the primary goal of supervised learning?', 10),
(8, 'Q2' ,'Which type of data is used in unsupervised learning?', 10),
(9, 'Q3' ,'In which scenario would you typically use supervised learning?', 10);

-- Insert data into Answer
INSERT INTO Answer (Answer_ID, Answer_Text, Answer_Explanation, Correct, Activity_ID) VALUES
(1, 'Data storage only', 'Incorrect: DBMS provides more than just storage', FALSE, 1),
(2, 'Data storage and retrieval', 'Correct: DBMS manages both storing and retrieving data', TRUE, 1),
(3, 'Only security features', 'Incorrect: DBMS also handles other functions', FALSE, 1),
(4, 'Network management', 'Incorrect: DBMS does not manage network infrastructure', FALSE, 1),
(5, 'Microsoft Excel', 'Incorrect: Excel is a spreadsheet application', FALSE, 2),
(6, 'MySQL', 'Correct: MySQL is a popular DBMS', TRUE, 2),
(7, 'Google Chrome', 'Incorrect: Chrome is a web browser', FALSE, 2),
(8, 'Windows 10', 'Incorrect: Windows is an operating system', FALSE, 2),
(9, 'Structured data', 'Correct: DBMS primarily manages structured data', TRUE, 3),
(10, 'Unstructured multimedia', 'Incorrect: While some DBMS systems can handle it, it\'s not core', FALSE, 3),
(11, 'Network traffic data', 'Incorrect: DBMS doesn’t manage network data', FALSE, 3),
(12, 'Hardware usage statistics', 'Incorrect: DBMS does not handle hardware usage data', FALSE, 3),
(13, 'A hardware shortage', 'Incorrect: The crisis was related to software development issues', FALSE, 3),
(14, 'Difficulty in software creation', 'Correct: The crisis was due to the complexity and unreliability of software', TRUE, 4),
(15, 'A network issue', 'Incorrect: It was not related to networking', FALSE, 4),
(16, 'Lack of storage devices', 'Incorrect: The crisis was not about physical storage limitations', FALSE, 4),
(17, 'Waterfall model', 'Correct: Waterfall was the first formal software development model', TRUE, 4),
(18, 'Agile methodology', 'Incorrect: Agile was introduced much later', FALSE, 5),
(19, 'DevOps', 'Incorrect: DevOps is a more recent development approach', FALSE, 5),
(20, 'Scrum', 'Incorrect: Scrum is a part of Agile, not the first methodology', FALSE, 5),
(21, 'Lack of programming languages', 'Incorrect: Programming languages existed but were difficult to manage', FALSE, 5),
(22, 'Increasing complexity of software', 'Correct: Early engineers struggled with managing large, complex systems', TRUE, 6),
(23, 'Poor hardware development', 'Incorrect: The issue was primarily with software, not hardware', FALSE, 6),
(24, 'Internet connectivity issues', 'Incorrect: Internet connectivity wasn\'t a challenge in early software', FALSE, 6),
(25, 'Predict outcomes', 'Correct: The goal is to learn a mapping from inputs to outputs for prediction.', TRUE, 6),
(26, 'Group similar data', 'Incorrect: This is more aligned with unsupervised learning.', FALSE, 7),
(27, 'Discover patterns', 'Incorrect: This is not the main goal of supervised learning.', FALSE, 7),
(28, 'Optimize cluster groups', 'Incorrect: This is not applicable to supervised learning.', FALSE, 8),
(29, 'Labeled data', 'Incorrect: Unsupervised learning uses unlabeled data.', FALSE, 8),
(30, 'Unlabeled data', 'Correct: It analyzes data without pre-existing labels.', TRUE, 8),
(31, 'Structured data', 'Incorrect: Unlabeled data can be structured or unstructured.', FALSE, 8),
(32, 'Time-series data', 'Incorrect: Unsupervised learning does not specifically focus on time-series.', FALSE, 9),
(33, 'Customer segmentation', 'Incorrect: This is more relevant to unsupervised learning.', FALSE, 9),
(34, 'Fraud detection', 'Correct: Supervised learning is ideal for predicting fraud based on labeled examples.', TRUE, 9),
(35, 'Market basket analysis', 'Incorrect: This is generally done using unsupervised methods.', FALSE, 9),
(36, 'Anomaly detection', 'Incorrect: While applicable, it is less common than fraud detection in supervised learning.', FALSE, 9);


-- Insert data into Active_Course
INSERT INTO Active_Course (Course_ID, Token, Course_Capacity) VALUES
('NCSUOganCSC440F24', 'XYJKLM', 60),
('NCSUOganCSC540F24', 'STUKZT', 50),
('NCSUSaraCSC326F24', 'LRUFND', 100);

-- Insert data into Enroll
INSERT INTO Enroll (Course_ID, Student_ID) VALUES
('NCSUOganCSC440F24', 'ErPe1024'),
('NCSUOganCSC540F24', 'ErPe1024'),
('NCSUOganCSC440F24', 'AlAr1024'),
('NCSUOganCSC440F24', 'BoTe1024'),
('NCSUOganCSC440F24', 'LiGa1024'),
('NCSUOganCSC540F24', 'LiGa1024'),
('NCSUOganCSC540F24', 'ArMo1024'),
('NCSUOganCSC440F24', 'ArMo1024'),
('NCSUOganCSC440F24', 'SiHa1024'),
('NCSUSaraCSC326F24', 'FiWi1024'),
('NCSUJegiCSC522F24', 'LeMe1024');

-- Insert data into Waitlist
INSERT INTO Waitlist (Course_ID, Student_ID) VALUES
('NCSUSaraCSC326F25', 'ErPe1024'),
('NCSUSaraCSC326F25', 'AlAr1024'),
('NCSUJegiCSC522F24', 'FiWi1024'),
('NCSUSaraCSC326F25', 'LeMe1024'),
('NCSUSaraCSC326F25', 'ArMo1024'),
('NCSUJegiCSC522F24', 'LiGa1024');

-- Insert data into Teaching_Assistant
INSERT INTO Teaching_Assistant (Course_ID, Student_ID) VALUES
('NCSUOganCSC440F24', 'KeOg1024'),
('NCSUOganCSC540F24', 'KeOg1024'),
('NCSUSaraCSC326F24', 'SaMi1024'),
('NCSUJegiCSC522F24', 'JeGi0924'),
('NCSUSaraCSC326F25', 'SaMi1024');


INSERT INTO Score (User_ID, Activity_ID, Course_ID, TStamp, Score) VALUES
('ErPe1025', 1, 'NCSUOganCSC440F24', '2024.08.01-11:10', 3),
('ErPe1025', 2, 'NCSUOganCSC440F24', '2024.08.01-14:18', 1),
('ErPe1025', 1, 'NCSUOganCSC540F24', '2024.08.02-19:06', 1),
('AlAr1024', 1, 'NCSUOganCSC440F24', '2024.08.01-13:24', 3),
('BoTe1024', 1, 'NCSUOganCSC440F24', '2024.08.01-09:24', 0),
('LiGa1024', 1, 'NCSUOganCSC440F24', '2024.08.01-07:45', 3),
('LiGa1024', 2, 'NCSUOganCSC440F24', '2024.08.01-12:30', 3),
('LiGa1024', 1, 'NCSUOganCSC540F24', '2024.08.03-16:52', 3),
('ArMo1024', 1, 'NCSUOganCSC440F24', '2024.08.01-21:18', 1),
('ArMo1024', 2, 'NCSUOganCSC440F24', '2024.08.01-05:03', 3),
('FiWi1024', 4, 'NCSUSaraCSC326F24', '2024.08.29-22:41', 1),
('LeMe1024', 7, 'NCSUJegiCSC522F24', '2024.09.01-13:12', 3),
('LeMe1024', 8, 'NCSUJegiCSC522F24', '2024.09.09-18:27', 3);