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
DROP TABLE IF EXISTS Textbook;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS Person_Role;
DROP TABLE IF EXISTS Debug_Log;


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
    Created_By VARCHAR(50) NOT NULL,
    FOREIGN KEY (Created_By) REFERENCES Person(User_ID),
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
	Created_By VARCHAR(50) NOT NULL,
    FOREIGN KEY (Created_By) REFERENCES Person(User_ID),
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
    Content_BLK_ID INT NOT NULL,
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
    Notification_ID INT PRIMARY KEY AUTO_INCREMENT,
    Notification_Text Text NOT NULL,
    User_ID VARCHAR(50) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES Person(User_ID)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Score (
    User_ID VARCHAR(50),
    Course_ID VARCHAR(50),
    Question_ID VARCHAR(3),
    Activity_ID INT,
    TStamp DATETIME NOT NULL,
    Score INT NOT NULL,
    PRIMARY KEY (User_ID, Activity_ID, Question_ID, Course_ID),
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

USE zybooks;


-- BEGIN: Fetch Role Procedure
DROP PROCEDURE IF EXISTS fetch_roles;
DELIMITER //
CREATE PROCEDURE fetch_roles()
BEGIN
    SELECT role_id, role_name FROM Person_role;
END;
//
-- END: Fetch Role Procedure

-- 2. Create Faculty when logged in as Admin, returns number of user created.
DELIMITER #
DROP FUNCTION IF EXISTS create_faculty#
CREATE FUNCTION create_faculty(user_role_id INT, first_name VARCHAR(255) , last_name VARCHAR(255), email VARCHAR(255), user_password VARCHAR(255))
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE admin_role_id INT;
    DECLARE faculty_role_id INT;
    DECLARE new_user_id VARCHAR(8);
    SELECT role_id INTO admin_role_id FROM Person_Role WHERE Role_name = 'Admin';
    SELECT role_id INTO faculty_role_id FROM Person_Role WHERE Role_name = 'Faculty';

    IF user_role_id = admin_role_id THEN
		SET new_user_id = CONCAT(
            SUBSTRING(First_name, 1, 2),
            SUBSTRING(Last_name, 1, 2),
            DATE_FORMAT(CURDATE(), '%m%y')
            );
		INSERT INTO Person (User_ID, First_name, Last_name, Email, Password, Created_On, Role_ID) VALUES
			(new_user_id, first_name, last_name, email, user_password, CURDATE(), faculty_role_id);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to create a faculty';
	END IF;

END#
-- SELECT create_faculty(1, 'Swaraj', 'Kaondal', 'swaraj@kaondal.com', 'yoman123');
-- ----------------------------------------------------------


-- 3. create_textbook
DELIMITER #
DROP FUNCTION IF EXISTS create_textbook#
CREATE FUNCTION create_textbook(user_role_id INT, title VARCHAR(255))
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE admin_role_id INT;
    SELECT role_id INTO admin_role_id FROM Person_Role WHERE Role_name = 'Admin';

    IF user_role_id = admin_role_id THEN
		INSERT INTO Textbook (Title) VALUES
			(title);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to create a textbook';
    END IF;

END#

-- ----------------------------------------------------------

-- 4. add_chapter
DELIMITER #
DROP FUNCTION IF EXISTS add_chapter#
CREATE FUNCTION add_chapter(user_role_id INT, title VARCHAR(255), chapter_number INT, textbook_id INT, user_id VARCHAR(255))
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
    DECLARE chapter_number_str CHAR(6);

	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';
    SET chapter_number_str = CONCAT('chap',LPAD(chapter_number, 2, '0'));

	IF user_role_id != student_role_id THEN
		INSERT INTO Chapter(Chapter_number, Title, Textbook_ID, Created_By) VALUES
			(chapter_number_str, title, textbook_id, user_id);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add chapter';
    END IF;

END#

-- ----------------------------------------------------------


-- 5. add_section
DELIMITER #
DROP FUNCTION IF EXISTS add_section#
CREATE FUNCTION add_section(user_role_id INT, title VARCHAR(255), section_number INT, chapter_id INT, user_id VARCHAR(255))
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';

	IF user_role_id != student_role_id THEN
		INSERT INTO Section(Section_number, Title, Chapter_ID, Created_By) VALUES
			(section_number, title, chapter_id, user_id);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add section';
    END IF;

END#

-- ----------------------------------------------------------

-- 6. add_content_block
DELIMITER #
DROP FUNCTION IF EXISTS add_content_block#
CREATE FUNCTION add_content_block(user_role_id INT, user_id VARCHAR(50), sequence_number INT, section_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';

	IF user_role_id != student_role_id THEN
		INSERT INTO Content_Block(Created_By, Sequence_number, Section_ID) VALUES
			(user_id, sequence_number, section_id);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add content block';
    END IF;

END#
-- ----------------------------------------------------------


-- 7. add_text
DELIMITER #
DROP FUNCTION IF EXISTS add_text#
CREATE FUNCTION add_text(user_role_id INT, text_str VARCHAR(1023), content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';

	IF user_role_id != student_role_id THEN
		INSERT INTO Text_Block(Text, Content_BLK_ID) VALUES
			(text_str, content_blk_id);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add text';
    END IF;

END#
-- ----------------------------------------------------------


-- 8. add_picture
DELIMITER #
DROP FUNCTION IF EXISTS add_picture#
CREATE FUNCTION add_picture(user_role_id INT, image_path VARCHAR(1023), content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';

	IF user_role_id != student_role_id THEN
		INSERT INTO Image(Path, Content_BLK_ID) VALUES
			(image_path, content_blk_id);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add image';
    END IF;

END#
-- ----------------------------------------------------------



-- 9. add_activity
DELIMITER #
DROP FUNCTION IF EXISTS add_activity#
CREATE FUNCTION add_activity(user_role_id INT, question_id VARCHAR(3), question VARCHAR(1023), content_blk_id INT,
	ans_txt_1 VARCHAR(255), ans_explain_1 VARCHAR(255), correct_1 BOOLEAN,
    ans_txt_2 VARCHAR(255), ans_explain_2 VARCHAR(255), correct_2 BOOLEAN,
    ans_txt_3 VARCHAR(255), ans_explain_3 VARCHAR(255), correct_3 BOOLEAN,
    ans_txt_4 VARCHAR(255), ans_explain_4 VARCHAR(255), correct_4 BOOLEAN
	)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';

	IF user_role_id != student_role_id THEN
		INSERT INTO Activity(Question_id, Question, Content_BLK_ID) VALUES
			(question_id, question, content_blk_id);

		SELECT LAST_INSERT_ID() INTO question_id;

        INSERT INTO Answer(Answer_Text, Answer_Explanation, Correct, Activity_ID)
        VALUES(ans_txt_1, ans_explain_1, correct_1, question_id);

        INSERT INTO Answer(Answer_Text, Answer_Explanation, Correct, Activity_ID)
        VALUES(ans_txt_2, ans_explain_2, correct_2, question_id);

        INSERT INTO Answer(Answer_Text, Answer_Explanation, Correct, Activity_ID)
        VALUES(ans_txt_3, ans_explain_3, correct_3, question_id);

        INSERT INTO Answer(Answer_Text, Answer_Explanation, Correct, Activity_ID)
        VALUES(ans_txt_4, ans_explain_4, correct_4, question_id);

		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add activity';
    END IF;

END#
-- ----------------------------------------------------------


-- 10. add_active_course
DELIMITER #
DROP FUNCTION IF EXISTS add_active_course#
CREATE FUNCTION add_active_course(user_role_id INT, course_id VARCHAR(50), course_name VARCHAR(255), faculty VARCHAR(50), start_date DATE, end_date DATE, Textbook_ID INT, token VARCHAR(255), course_cap INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE admin_role_id INT;
    DECLARE faculty_role_id INT;
    DECLARE assigned_faculty_role_id INT;
    SELECT role_id INTO admin_role_id FROM Person_Role WHERE Role_name = 'Admin';
    SELECT role_id INTO faculty_role_id FROM Person_Role WHERE Role_name = 'Faculty';
    SELECT role_id INTO assigned_faculty_role_id from Person P where P.user_id = faculty;


	IF user_role_id = admin_role_id AND faculty_role_id = assigned_faculty_role_id THEN
		INSERT INTO Course(Course_ID, Title, Faculty, Start_Date, End_Date, Type, Textbook_ID) VALUES
			(course_id, course_name, faculty, start_date, end_date, 'ACTIVE',Textbook_ID);

		INSERT INTO Active_Course(Course_ID, Token, Course_Capacity)
		VALUES(course_id, token, course_cap);
		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add course';
    END IF;

END#
-- ----------------------------------------------------------


-- 11. add_eval_course
DELIMITER #
DROP FUNCTION IF EXISTS add_eval_course#
CREATE FUNCTION add_eval_course(user_role_id INT, course_id VARCHAR(50), course_name VARCHAR(255), faculty VARCHAR(50), start_date DATE, end_date DATE, Textbook_ID INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE admin_role_id INT;
    SELECT role_id INTO admin_role_id FROM Person_Role WHERE Role_name = 'Admin';

	IF user_role_id = admin_role_id THEN
		INSERT INTO Course(Course_ID, Title, Faculty, Start_Date, End_Date, Type, Textbook_ID) VALUES
			(course_id, course_name, faculty, start_date, end_date, 'EVALUATION', Textbook_ID);

		RETURN 1;
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to add course';
    END IF;

END#
-- ----------------------------------------------------------

-- 10. hide_content_block
DELIMITER #
DROP FUNCTION IF EXISTS admin_hide_content#
CREATE FUNCTION admin_hide_content(content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
  UPDATE Content_Block cont_blk SET Hidden = TRUE WHERE cont_blk.Content_BLK_ID = content_blk_id;
  RETURN 1;
END#

-- 11. delete_content_block
DELIMITER #
DROP FUNCTION IF EXISTS admin_delete_content#
CREATE FUNCTION admin_delete_content(content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
  DELETE FROM Answer WHERE Activity_ID IN (SELECT Activity_ID FROM Activity act_id WHERE act_id.Content_BLK_ID = content_blk_id);
  DELETE FROM Activity act WHERE act.Content_BLK_ID = content_blk_id;
  DELETE FROM Image img WHERE img.Content_BLK_ID = content_blk_id;
  DELETE FROM Text_Block txt WHERE txt.Content_BLK_ID = content_blk_id;
  DELETE FROM Content_Block cont_blk WHERE cont_blk.Content_BLK_ID = content_blk_id;
  RETURN 1;

END#
DELIMITER ;

-- Procedure to view worklist
DROP PROCEDURE IF EXISTS faculty_view_worklist;
DELIMITER //
CREATE PROCEDURE faculty_view_worklist(IN course_id VARCHAR(255))
BEGIN
	SELECT W.Student_ID, P.First_Name, P.Last_Name, P.email, PR.Role_Name, P.Role_ID
    FROM Waitlist W, Person P, Person_Role PR
    WHERE W.Course_ID = course_id
    AND W.Student_ID = P.User_ID
    AND P.Role_ID = PR.Role_ID;
END; //
DELIMITER ;


DROP TRIGGER IF EXISTS after_enroll_insert;
DELIMITER //
CREATE TRIGGER after_enroll_insert
AFTER INSERT ON ENROLL
FOR EACH ROW
BEGIN
    DECLARE enrolled_count INT DEFAULT 0;
    DECLARE course_capacity INT DEFAULT 0;

    -- Get the current number of students enrolled in the course
    SELECT COUNT(*)
    INTO enrolled_count
    FROM ENROLL
    WHERE Course_ID = NEW.Course_ID;

    -- Get the capacity of the course
    SELECT AC.Course_Capacity
    INTO course_capacity
    FROM Active_Course AC
    WHERE AC.Course_ID = NEW.Course_ID;

    -- Check if the capacity is reached
    IF enrolled_count >= course_capacity THEN
        -- Call procedure to notify students on the waitlist and remove them
        CALL send_course_full_notification(NEW.Course_ID);
        DELETE FROM Waitlist WHERE Course_ID = NEW.Course_ID;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS send_course_full_notification;
DELIMITER //
CREATE PROCEDURE send_course_full_notification(IN course_id VARCHAR(255))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE student_id VARCHAR(255);

    -- Cursor to select students from the Waitlist table for the specified course_id
    DECLARE waitlist_cursor CURSOR FOR SELECT W.student_id FROM Waitlist W WHERE W.Course_ID = course_id;

    -- Handler to exit loop when no more rows are found in the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open cursor
    OPEN waitlist_cursor;

    -- Loop through each student in the cursor
    read_loop: LOOP
        FETCH waitlist_cursor INTO student_id;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Check that student_id is not NULL before inserting
        IF student_id IS NOT NULL THEN
            -- Insert notification for each student on the waitlist
            INSERT INTO Notification (Notification_Text, User_Id)
            VALUES (CONCAT('Course ', course_id, ' is full; you have been removed from the waitlist.'), student_id);
        END IF;
    END LOOP;

    -- Close cursor after processing
    CLOSE waitlist_cursor;
END; //
DELIMITER ;


-- Procedure to approve enrollments
DROP PROCEDURE IF EXISTS faculty_approve_student;
DELIMITER //
CREATE PROCEDURE faculty_approve_student(IN course_id VARCHAR(255), IN student_id VARCHAR(255))
BEGIN
	START TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM Waitlist W WHERE W.Course_ID = course_id AND W.Student_ID = student_id) THEN
		SIGNAL SQLSTATE '45000'
		 SET MESSAGE_TEXT = 'Enrollment failed', MYSQL_ERRNO = 2001;
         ROLLBACK;
	END IF;
		DELETE FROM Waitlist W
		WHERE W.Course_ID = course_id
		AND W.Student_ID = student_id;

        INSERT INTO ENROLL VALUES(
			course_id, student_id
        );

        COMMIT;


END; //
DELIMITER ;

DROP PROCEDURE IF EXISTS faculty_view_students;
DELIMITER //
CREATE PROCEDURE faculty_view_students(IN course_id VARCHAR(255))
BEGIN
	SELECT P.User_ID, P.First_name, P.Last_name, P.email, PR.Role_Name, P.role_id
    FROM Person P, Person_Role PR
    WHERE P.User_ID IN (
		SELECT AC.Student_ID
        FROM Enroll AC
        WHERE AC.Course_ID = course_id
    ) AND P.Role_ID = PR.Role_ID;
END; //

DELIMITER ;


-- Procedure to get courses for a faculty
DROP PROCEDURE IF EXISTS faculty_get_courses;
DELIMITER //
CREATE PROCEDURE faculty_get_courses(IN user_id VARCHAR(255))
BEGIN
	IF NOT EXISTS (SELECT 1 FROM Person P WHERE P.User_ID = user_id) THEN
        -- Throw an error if the user_id does not exist
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The person does not exist', MYSQL_ERRNO = 1001;
    ELSE
        -- If the user_id exists, select the courses
        SELECT Course_ID, Title
        FROM Course
        WHERE Faculty = user_id;
    END IF;
END; //

DELIMITER ;

-- hide_content_block
DELIMITER #
DROP FUNCTION IF EXISTS faculty_hide_content#
CREATE FUNCTION faculty_hide_content(content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
  UPDATE Content_Block cont_blk SET Hidden = TRUE WHERE cont_blk.Content_BLK_ID = content_blk_id;
  RETURN 1;

END#

-- delete_content_block
DELIMITER #
DROP FUNCTION IF EXISTS faculty_delete_content#
CREATE FUNCTION faculty_delete_content(content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
  DELETE FROM Answer WHERE Activity_ID IN (SELECT Activity_ID FROM Activity act_id WHERE act_id.Content_BLK_ID = content_blk_id);
  DELETE FROM Activity act WHERE act.Content_BLK_ID = content_blk_id;
  DELETE FROM Image img WHERE img.Content_BLK_ID = content_blk_id;
  DELETE FROM Text_Block txt WHERE txt.Content_BLK_ID = content_blk_id;
  DELETE FROM Content_Block cont_blk WHERE cont_blk.Content_BLK_ID = content_blk_id;
  RETURN 1;

END#

DELIMITER ;


-- add new TA
DROP PROCEDURE IF EXISTS faculty_add_ta;
DELIMITER //
CREATE PROCEDURE faculty_add_ta(IN user_role_id INT, IN first_name VARCHAR(255), IN last_name VARCHAR(255), IN email VARCHAR(255), IN default_password VARCHAR(255), IN course_id VARCHAR(255))
BEGIN
	DECLARE ta_role_id INT;
    DECLARE faculty_role_id INT;
    DECLARE new_user_id VARCHAR(8);
    SELECT role_id INTO ta_role_id FROM Person_Role WHERE Role_name = 'Teaching Assistant';
    SELECT role_id INTO faculty_role_id FROM Person_Role WHERE Role_name = 'Faculty';

    IF user_role_id = faculty_role_id THEN
		SET new_user_id = CONCAT(
            SUBSTRING(First_name, 1, 2),
            SUBSTRING(Last_name, 1, 2),
            DATE_FORMAT(CURDATE(), '%m%y')
            );

		INSERT INTO Person (User_ID, First_name, Last_name, Email, Password, Created_On, Role_ID) VALUES
			(new_user_id, first_name, last_name, email, default_password, CURDATE(), ta_role_id);

        INSERT INTO Teaching_Assistant (Course_ID, Student_ID)
        VALUES (course_id, new_user_id);
    ELSE
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User does not have the permission to create a faculty';
	END IF;
END; //

DELIMITER ;


-- Procedure to login a user
DROP PROCEDURE IF EXISTS person_login;
DELIMITER //
CREATE PROCEDURE person_login(IN user_id VARCHAR(255), IN password VARCHAR(255))
BEGIN
	DECLARE user_count INT;
	IF NOT EXISTS (SELECT 1 FROM Person P WHERE P.User_ID = user_id AND P.Password = password) THEN
        -- Throw an error if the user_id does not exist
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The username or password is incorrect', MYSQL_ERRNO = 401;
    ELSE
		SELECT P.User_ID, P.First_name, P.Last_name, P.email, P.Role_ID, R.Role_name
        FROM Person P, Person_Role R
        Where P.Role_ID = R.Role_ID
        AND P.User_ID = user_id
        AND P.Password = password;
	END IF;
END; //

DELIMITER ;

-- Return 0 if unsucessfull else return 1
DROP FUNCTION IF EXISTS person_change_password;
DELIMITER //
CREATE FUNCTION person_change_password(user_id VARCHAR(50), old_password VARCHAR(255), new_password VARCHAR(255))
	RETURNS INT
	DETERMINISTIC
BEGIN

	IF NOT EXISTS (SELECT 1 FROM Person P WHERE P.User_ID = user_id AND P.Password = old_password) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The username or password is incorrect', MYSQL_ERRNO = 401;
        RETURN 0;
    END IF;

	UPDATE Person P
    SET P.password = new_password
    WHERE P.User_ID = user_id
    AND P.Password = old_password;

    RETURN 1;
END;
//
DELIMITER ;

-- Procedure to get notifications
DROP PROCEDURE IF EXISTS person_notification;
DELIMITER //
CREATE PROCEDURE person_notification(IN user_id VARCHAR(255))
BEGIN
	SELECT N.Notification_Text FROM Notification N WHERE N.User_ID = user_id;

    DELETE FROM Notification N WHERE N.User_ID = user_id;
END; //

DELIMITER ;


DROP PROCEDURE IF EXISTS person_add_student;
DELIMITER //
CREATE PROCEDURE person_add_student(IN first_name VARCHAR(50), IN last_name VARCHAR(255), IN email VARCHAR(255), IN course_token VARCHAR(255))
BEGIN

	DECLARE new_user_id VARCHAR(8);
    DECLARE student_role_id INT;

	IF EXISTS (SELECT 1 FROM Person P WHERE P.email = email) THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The email is already taken', MYSQL_ERRNO = 401;
    END IF;

    SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';

	SET new_user_id = CONCAT(
            SUBSTRING(first_name, 1, 2),
            SUBSTRING(last_name, 1, 2),
            DATE_FORMAT(CURDATE(), '%m%y')
            );

	INSERT INTO Person (User_ID, First_name, Last_name, Email, Password, Created_On, Role_ID) VALUES
		(new_user_id, first_name, last_name, email, 'temppass', CURDATE(), student_role_id);

	SELECT enroll_student(email, course_token);
END;
//
DELIMITER ;


-- 1. Enroll students into course
DROP FUNCTION IF EXISTS enroll_student;
DELIMITER #
CREATE FUNCTION enroll_student(email VARCHAR(255), course_token VARCHAR(255))
    RETURNS INT
    DETERMINISTIC
BEGIN
    DECLARE cap INT DEFAULT 0;
    DECLARE student_id VARCHAR(50);
    DECLARE course_id VARCHAR(50);

    -- Retrieve the course_id from the token
    SELECT A.Course_ID INTO course_id
    FROM Active_Course AS A
    WHERE A.Token = course_token;

    -- Check if the course_id was found
    IF course_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid course token';
        RETURN 0;
    END IF;

    -- Get the student's ID
    SELECT User_ID INTO student_id
    FROM Person AS P
    WHERE P.Email = email;

    -- Check if the student_id was found
    IF student_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid student email';
        RETURN 0;
    END IF;

    -- Check current enrollment for the course
    SELECT COUNT(*) INTO cap
    FROM Enroll AS E
    WHERE E.Course_ID = course_id;

    -- Check course capacity
    IF cap >= (
        SELECT AC.Course_Capacity
        FROM Active_Course AC
        WHERE AC.Course_ID = course_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course capacity has been reached!';
        RETURN 0;
    END IF;

    -- If there's space, add the student to the waitlist
    INSERT INTO Waitlist (Course_ID, Student_ID)
    VALUES (course_id, student_id);

    RETURN 1;

END #
DELIMITER ;

-- 2. Save score
DELIMITER #
DROP FUNCTION IF EXISTS save_score#
CREATE FUNCTION save_score(User_ID VARCHAR(50),
    Course_ID VARCHAR(50),
    Question_ID VARCHAR(3),
    Activity_ID INT,
    Score INT)

    RETURNS INT
    DETERMINISTIC
BEGIN

    INSERT INTO Score VALUES
			(User_ID, Course_ID, Question_ID, Activity_ID, current_time(), Score);
	RETURN 1;

END #
DELIMITER ;

DROP PROCEDURE IF EXISTS student_score;
DELIMITER //
CREATE PROCEDURE student_score(IN user_id VARCHAR(8))
BEGIN
	DECLARE total INT;
    DECLARE total_score INT;

	select count(*)*3 into total from Enroll E
	inner join Course C on E.Course_ID = C.Course_ID
	inner join Textbook T on C.Textbook_ID = T.Textbook_ID
	inner join Chapter CH on CH.Textbook_ID = T.Textbook_ID
	inner join Section S on S.Chapter_ID = CH.Chapter_ID
	inner join Content_Block CB on CB.Section_ID = S.Section_ID
	inner join Activity A on A.Content_BLK_ID = CB.Content_BLK_ID
	where E.Student_ID = user_id;

	select sum(S.score) into total_score from Score S where S.User_ID = user_id group by S.user_id;

    select total, total_score;

END; //
DELIMITER ;

-- hide_content_block
DROP PROCEDURE IF EXISTS ta_hide_content;
DELIMITER //
CREATE PROCEDURE ta_hide_content(IN content_blk_id INT)
BEGIN

	DECLARE current_hidden bool;

    SELECT C.Hidden INTO current_hidden FROM Content_Block C WHERE C.Content_BLK_ID = content_blk_id;

    IF current_hidden = TRUE THEN
		UPDATE content_block cont_blk
		SET Hidden = FALSE
		WHERE cont_blk.Content_BLK_ID = content_blk_id;
	ELSE
		UPDATE content_block cont_blk
		SET Hidden = TRUE
		WHERE cont_blk.Content_BLK_ID = content_blk_id;
	END IF;
END ; //

DELIMITER ;

DROP PROCEDURE IF EXISTS ta_hide_section;
DELIMITER //
CREATE PROCEDURE ta_hide_section(IN section_id INT)
BEGIN

	DECLARE current_hidden bool;

    SELECT S.Hidden INTO current_hidden FROM Section S WHERE S.section_id = section_id;

    IF current_hidden = TRUE THEN
		UPDATE Section S
		SET Hidden = FALSE
		WHERE S.section_id = section_id;
	ELSE
		UPDATE Section S
		SET Hidden = TRUE
		WHERE S.section_id = section_id;
	END IF;
END ; //

DELIMITER ;

DROP PROCEDURE IF EXISTS ta_hide_chapter;
DELIMITER //
CREATE PROCEDURE ta_hide_chapter(IN chapter_id INT)
BEGIN

	DECLARE current_hidden bool;

    SELECT C.Hidden INTO current_hidden FROM Chapter C WHERE C.chapter_id = chapter_id;

    IF current_hidden = TRUE THEN
		UPDATE Chapter C
		SET Hidden = FALSE
		WHERE C.chapter_id = chapter_id;
	ELSE
		UPDATE Chapter C
		SET Hidden = TRUE
		WHERE C.chapter_id = chapter_id;
	END IF;
END ; //

DELIMITER ;

-- delete_content_block
DROP PROCEDURE IF EXISTS ta_delete_content;
DELIMITER //
CREATE PROCEDURE ta_delete_content(IN content_blk_id INT)
BEGIN
  DELETE FROM Answer WHERE Activity_ID IN (SELECT Activity_ID FROM Activity act_id WHERE act_id.Content_BLK_ID = content_blk_id);
  DELETE FROM Activity act WHERE act.Content_BLK_ID = content_blk_id;
  DELETE FROM Image img WHERE img.Content_BLK_ID = content_blk_id;
  DELETE FROM Text_Block txt WHERE txt.Content_BLK_ID = content_blk_id;
  DELETE FROM Content_Block cont_blk WHERE cont_blk.Content_BLK_ID = content_blk_id;
END; //

DELIMITER ;

DROP PROCEDURE IF EXISTS ta_delete_section;
DELIMITER //
CREATE PROCEDURE ta_delete_section(IN section_id INT)
BEGIN
  DELETE FROM Section S WHERE S.section_id = section_id;
END; //

DELIMITER ;

DROP PROCEDURE IF EXISTS ta_delete_chapter;
DELIMITER //
CREATE PROCEDURE ta_delete_chapter(IN chapter_id INT)
BEGIN
  DELETE FROM Chapter C WHERE C.chapter_id = chapter_id;
END; //

DELIMITER ;
