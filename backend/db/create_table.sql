USE zybooks;

DROP TABLE IF EXISTS Answer;
DROP TABLE IF EXISTS Score;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Image;
DROP TABLE IF EXISTS Text_Block;
DROP TABLE IF EXISTS Content_Block;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Teaching_Assistant;
DROP TABLE IF EXISTS Enroll;
DROP TABLE IF EXISTS Waitlist;
DROP TABLE IF EXISTS Active_Course;
DROP TABLE IF EXISTS Section;
DROP TABLE IF EXISTS Chapter;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS Person_Role;
DROP TABLE IF EXISTS Textbook;

CREATE TABLE Person_Role (
    Role_ID INT PRIMARY KEY,
    Role_name VARCHAR(255) NOT NULL
);


CREATE TABLE Person (
    User_ID VARCHAR(50) PRIMARY KEY,
    First_name VARCHAR(255) NOT NULL,
    Last_name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Created_On DATE NOT NULL,
    Role_ID INT NOT NULL,
    FOREIGN KEY (Role_ID) REFERENCES Person_Role(Role_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    CHECK (
        User_ID = CONCAT(
            SUBSTRING(First_name, 1, 2),
            SUBSTRING(Last_name, 1, 2),
            DATE_FORMAT(Created_On, '%m%y')
        )
    ),
    CONSTRAINT email_format CHECK (Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.(com|edu|mail)$')
);



CREATE TABLE Textbook (
    Textbook_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Course (
    Course_ID VARCHAR(50) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Faculty VARCHAR(50) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Type ENUM('EVALUATION', 'ACTIVE') NOT NULL,
    Textbook_ID INT NOT NULL,
    FOREIGN KEY (Faculty) REFERENCES Person(User_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (Textbook_ID) REFERENCES Textbook(Textbook_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Chapter (
    Chapter_ID INT AUTO_INCREMENT PRIMARY KEY,
    Chapter_number CHAR(6) NOT NULL CHECK(Chapter_number REGEXP '^chap[0-9]{2}$'),
    Hidden BOOLEAN NOT NULL DEFAULT FALSE,
    Title VARCHAR(255) NOT NULL,
    Textbook_ID INT NOT NULL,
    CONSTRAINT unique_chapter UNIQUE(Textbook_ID, Chapter_number),
    FOREIGN KEY (Textbook_ID) REFERENCES Textbook(Textbook_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Section (
    Section_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Section_number char(5) NOT NULL,
    Chapter_ID INT NOT NULL,
    Hidden BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT unique_section UNIQUE(Chapter_ID, Section_number),
    FOREIGN KEY (Chapter_ID) REFERENCES Chapter(Chapter_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Content_Block (
    Content_BLK_ID INT AUTO_INCREMENT PRIMARY KEY,
    Hidden BOOLEAN NOT NULL DEFAULT FALSE,
    Created_By VARCHAR(50) NOT NULL,
    Sequence_number INT NOT NULL,
    Section_ID INT NOT NULL,
    CONSTRAINT unique_content_blk UNIQUE(Section_ID, Sequence_number), 
    FOREIGN KEY (Created_By) REFERENCES Person(User_ID),
    FOREIGN KEY (Section_ID) REFERENCES Section(Section_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Image (
    Image_ID INT AUTO_INCREMENT PRIMARY KEY,
    Path VARCHAR(255) NOT NULL,
    Content_BLK_ID INT NOT NULL,
    FOREIGN KEY (Content_BLK_ID) REFERENCES Content_Block(Content_BLK_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Text_Block (
    Text_BLK_ID INT AUTO_INCREMENT PRIMARY KEY,
    Text TEXT NOT NULL,
    Content_BLK_ID INT UNIQUE NOT NULL,
    FOREIGN KEY (Content_BLK_ID) REFERENCES Content_Block(Content_BLK_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Activity (
    Activity_ID INT AUTO_INCREMENT PRIMARY KEY,
    Question_ID VARCHAR(3) NOT NULL,
    Question VARCHAR(255) NOT NULL,
    Content_BLK_ID INT NOT NULL,
    FOREIGN KEY (Content_BLK_ID) REFERENCES Content_Block(Content_BLK_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Answer (
    Answer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Answer_Text TEXT NOT NULL,
    Answer_Explanation TEXT NOT NULL,
    Correct BOOLEAN NOT NULL,
    Activity_ID INT NOT NULL,
    FOREIGN KEY (Activity_ID) REFERENCES Activity(Activity_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Active_Course (
    Course_ID VARCHAR(50),
    Token VARCHAR(255) UNIQUE NOT NULL,
    Course_Capacity INT NOT NULL,
    PRIMARY KEY (Course_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Enroll (
    Course_ID VARCHAR(50),
    Student_ID VARCHAR(50),
    PRIMARY KEY (Course_ID, Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Student_ID) REFERENCES Person(User_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Waitlist (
    Course_ID VARCHAR(50),
    Student_ID VARCHAR(50),
    PRIMARY KEY (Course_ID, Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Student_ID) REFERENCES Person(User_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Teaching_Assistant (
    Course_ID VARCHAR(50),
    Student_ID VARCHAR(50),
    PRIMARY KEY (Course_ID, Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Student_ID) REFERENCES Person(User_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Notification (
    Notification_ID INT PRIMARY KEY,
    Text VARCHAR(255) NOT NULL,
    User_ID VARCHAR(50) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES Person(User_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Score (
    User_ID VARCHAR(50),
    Course_ID VARCHAR(50),
    Activity_ID INT,
    TStamp DATETIME NOT NULL,
    Score INT NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES Person(User_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Activity_ID) REFERENCES Activity(Activity_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);