USE zybooks;

-- 1. Login, returns number of user that match the input parameters. Invalid user if 0.
DROP FUNCTION IF EXISTS login;
DELIMITER //
CREATE FUNCTION login(role_id INT, user_id VARCHAR(50), user_password VARCHAR(255))
	RETURNS INT
	READS SQL DATA
BEGIN
	DECLARE user_count INT;
    
    SELECT count(*) INTO user_count FROM PERSON as P
    WHERE P.Role_ID = role_id 
    AND P.User_ID = user_id
    AND P.password = user_password;
    
    RETURN user_count;
END;
-- select login(2, 'AlJo0923', 'password123');
-- ----------------------------------------------------------

-- 2. Create Faculty when logged in as Admin, returns number of user created.
DROP FUNCTION IF EXISTS create_faculty;
DELIMITER //
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
		RETURN 0;
	END IF;
    
END;
-- SELECT create_faculty(1, 'Swaraj', 'Kaondal', 'swaraj@kaondal.com', 'yoman123');
-- ----------------------------------------------------------


-- 3. create_textbook, returns the number of textbooks created.
DROP FUNCTION IF EXISTS create_textbook;
DELIMITER //
CREATE FUNCTION create_textbook(user_role_id INT, textbook_id INT, title VARCHAR(255), course_id VARCHAR(50))
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE admin_role_id INT;
    SELECT role_id INTO admin_role_id FROM Person_Role WHERE Role_name = 'Admin';
    
    IF user_role_id = admin_role_id THEN
		INSERT INTO Textbook (Textbook_ID, Title, Course_ID) VALUES
			(textbook_id, title, course_id);
		RETURN 1;
    ELSE
		RETURN 0;
    END IF;
    
END;
-- ----------------------------------------------------------

-- 4. add_chapter, returns the number of textbooks created.
DROP FUNCTION IF EXISTS add_chapter;
DELIMITER //
CREATE FUNCTION add_chapter(user_role_id INT, title VARCHAR(255), chapter_number INT, textbook_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE student_role_id INT;
    DECLARE chapter_number_str CHAR(6);

	SELECT role_id INTO student_role_id FROM Person_Role WHERE Role_name = 'Student';
    SET chapter_number_str = CONCAT('chap',LPAD(chapter_number, 2, '0'));
    
	IF user_role_id != student_role_id THEN
		INSERT INTO Chapter(Chapter_number, Title, Textbook_ID) VALUES
			(chapter_number_str, title, textbook_id);
		RETURN 1;
    ELSE
		RETURN 0;
    END IF;
    
END;
-- ----------------------------------------------------------
