use zybooks;

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
    SELECT Course_Capacity 
    INTO course_capacity
    FROM Active_Course AC
    WHERE AC.Course_ID = NEW.Course_ID;
    
    

    -- Check if the capacity is reached
    IF enrolled_count >= course_capacity THEN
        -- Call procedure to notify students on the waitlist and remove them
        
        CALL send_course_full_notification(NEW.Course_ID);
        
        DELETE FROM Waitlist WHERE Course_ID = NEW.Course_ID;
        
        
    END IF;
END; //
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