-- hide_content_block
DELIMITER #
DROP FUNCTION IF EXISTS hide_content#
CREATE FUNCTION hide_content(content_blk_id INT)
	RETURNS INT
    DETERMINISTIC
BEGIN
  UPDATE Content_Block cont_blk SET Hidden = TRUE WHERE cont_blk.Content_BLK_ID = content_blk_id;
  RETURN 1;
END#

-- delete_content_block
DELIMITER #
DROP FUNCTION IF EXISTS delete_content#
CREATE FUNCTION delete_content(content_blk_id INT)
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