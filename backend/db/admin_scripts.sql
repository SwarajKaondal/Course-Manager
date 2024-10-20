USE zybooks;

-- 1. Login, returns number of user that match the input parameters. Invalid user if 0.
DROP FUNCTION IF EXISTS login;
DELIMITER //
CREATE FUNCTION login (role_id INT, user_id VARCHAR(50), user_password VARCHAR(255))
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
CREATE FUNCTION create_faculty(role_id INT, first_name VARCHAR(255) , last_name VARCHAR(255), email VARCHAR(255), user_password VARCHAR(255))
	RETURNS INT
    DETERMINISTIC
BEGIN
	DECLARE admin_role_id INT;
    DECLARE faculty_role_id INT;
    DECLARE new_user_id VARCHAR(8);
    DECLARE existing_user INT;
    SELECT role_id INTO admin_role_id FROM Person_Role WHERE Role_name = 'Admin';
    SELECT role_id INTO faculty_role_id FROM Person_Role WHERE Role_name = 'Faculty';
	
    IF role_id = admin_role_id THEN
		SET new_user_id = CONCAT(
            SUBSTRING(First_name, 1, 2),
            SUBSTRING(Last_name, 1, 2),
            DATE_FORMAT(CURDATE(), '%m%y')
            );
		SELECT COUNT(*) INTO existing_user FROM Person WHERE User_ID = new_user_id;
        
        IF (existing_user = 0) AND (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
			INSERT INTO Person (User_ID, First_name, Last_name, Email, Password, Created_On, Role_ID) VALUES
				(new_user_id, first_name, last_name, email, user_password, CURDATE(), faculty_role_id);
			RETURN 1;
        ELSE
			RETURN 0;
		END IF;
        
    ELSE
		RETURN 0;
	END IF;
    
END;
-- SELECT create_faculty(1, 'Swaraj', 'Kaondal', 'swaraj@kaondal.com', 'yoman123');
-- ----------------------------------------------------------
