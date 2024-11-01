use zybooks;

-- hide_content_block
DROP PROCEDURE IF EXISTS ta_hide_content;
DELIMITER //
CREATE PROCEDURE ta_hide_content(IN content_blk_id INT)
BEGIN

	DECLARE current_hidden bool;
    
    SELECT C.Hidden INTO current_hidden FROM Content_Block C WHERE C.Content_BLK_ID = content_blk_id;
    
    IF current_hidden = TRUE THEN
		UPDATE content_block cont_blk 
		SET Hidden = FALSE
		WHERE cont_blk.Content_BLK_ID = content_blk_id;
	ELSE
		UPDATE content_block cont_blk 
		SET Hidden = TRUE
		WHERE cont_blk.Content_BLK_ID = content_blk_id;
	END IF;
END ; //

DELIMITER ;

-- delete_content_block
DROP PROCEDURE IF EXISTS ta_delete_content;
DELIMITER //
CREATE PROCEDURE ta_delete_content(IN content_blk_id INT)
BEGIN
  DELETE FROM Answer WHERE Activity_ID IN (SELECT Activity_ID FROM Activity act_id WHERE act_id.Content_BLK_ID = content_blk_id);
  DELETE FROM Activity act WHERE act.Content_BLK_ID = content_blk_id;
  DELETE FROM Image img WHERE img.Content_BLK_ID = content_blk_id;
  DELETE FROM Text_Block txt WHERE txt.Content_BLK_ID = content_blk_id;
  DELETE FROM Content_Block cont_blk WHERE cont_blk.Content_BLK_ID = content_blk_id; 
END; //

DELIMITER ;