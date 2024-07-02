<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$senderId = $_POST['senderId'];
	$receiverId = $_POST['receiverId'];
    $content = $_POST['content'];
	$time = $_POST['time'];
    $update_type = $_POST['type'];

	$content = change_str_sign($content);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM mail WHERE sender_id=".$senderId." AND time=".$time;
	} else if ($update_type === 'edit') {
		$update_sql = "UPDATE mail SET content='".$content."' WHERE sender_id=".$senderId." AND time=".$time;
	} else if ($update_type === 'add') {
		$update_sql = "INSERT INTO mail (sender_id, receiver_id, content, time) VALUES (".$senderId.", ".$receiverId.", '".$content."', ".$time.")";
		$update_sql = "UPDATE mail SET note='".$note."' WHERE sender=".$sender." AND time=".$time;
    }
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
		// $max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM news");
		// $row = mysqli_fetch_row($max_id_result);
		// $max_id = $row[0];
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error, 'update_sql'=>$update_sql]);
	mysqli_close($conn);
?>
