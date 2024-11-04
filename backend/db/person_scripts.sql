USE zybooks;


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




