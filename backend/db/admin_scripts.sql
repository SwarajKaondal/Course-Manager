USE zybooks;

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



