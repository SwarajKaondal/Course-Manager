USE zybooks;

-- 1. Enroll students into course
DELIMITER #
DROP FUNCTION IF EXISTS enroll_student#
CREATE FUNCTION enroll_student( email VARCHAR(255), course_token VARCHAR(255))
    RETURNS INT
    DETERMINISTIC
BEGIN

    DECLARE student_id VARCHAR(50);
    DECLARE course_id VARCHAR(50);
    SELECT User_ID INTO student_id FROM Person as P WHERE P.Email = email;
    SELECT A.Course_ID INTO course_id FROM Active_Course as A WHERE Token = course_token;

    INSERT INTO Enroll VALUES
			(course_id, student_id);
	RETURN 1;

END #




