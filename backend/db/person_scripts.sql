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




