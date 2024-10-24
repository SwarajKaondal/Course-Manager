USE zybooks;


-- BEGIN: Fetch Role Procedure
DROP PROCEDURE IF EXISTS fetch_roles;
DELIMITER //
CREATE PROCEDURE fetch_roles()
BEGIN
    SELECT role_id, role_name FROM Person_role;
END;
//
-- END: Fetch Role Procedure