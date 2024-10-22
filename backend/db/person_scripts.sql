USE zybooks;

-- Return 0 if unsucessfull else return 1
DROP FUNCTION IF EXISTS change_password;
DELIMITER //
CREATE FUNCTION change_password(user_id VARCHAR(50), old_password VARCHAR(255), new_password VARCHAR(255))
	RETURNS INT
	DETERMINISTIC
BEGIN
	UPDATE Person P
    SET P.password = new_password
    WHERE P.User_ID = user_id
    AND P.Password = old_password;
    
    IF ROW_COUNT() > 0 THEN
        RETURN 1; -- Success
    ELSE
        RETURN 0; -- Failure (either user_id or old_password is incorrect)
    END IF;
END;
//
DELIMITER ;

