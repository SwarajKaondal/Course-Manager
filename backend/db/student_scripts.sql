USE zybooks;

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
