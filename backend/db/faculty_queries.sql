use zybooks;

-- Procedure to view worklist
DROP PROCEDURE IF EXISTS faculty_view_worklist;
DELIMITER //
CREATE PROCEDURE faculty_view_worklist(IN course_id VARCHAR(255))
BEGIN
	SELECT W.Student_ID
    FROM Waitlist W
    WHERE W.Course_ID = course_id;
END; //
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS after_enroll_insert;
CREATE TRIGGER after_enroll_insert
AFTER INSERT ON ENROLL
FOR EACH ROW
BEGIN
    DECLARE enrolled_count INT;
    DECLARE course_capacity INT;

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
        -- Delete all students from the waitlist for the course
        DELETE FROM Waitlist 
        WHERE Course_ID = NEW.Course_ID;
    END IF;
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
	SELECT P.User_ID, P.First_name, P.Last_name
    FROM Person P
    WHERE P.User_ID IN (
		SELECT AC.Student_ID
        FROM Enroll AC
        WHERE AC.Course_ID = course_id
    );
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
