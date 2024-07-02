<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$sender = $_POST['senderId'];
    $content = $_POST['content'];
	$time = $_POST['time'];
    $note = $_POST['note'];
    $update_type = $_POST['type'];

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM message WHERE sender=".$sender." AND time=".$time;
	} else if ($update_type === 'edit') {
        $content = change_str_sign($content);
		$update_sql = "UPDATE message SET content='".$content."' WHERE sender=".$sender." AND time=".$time;
	} else if ($update_type === 'note') {
        $note = change_str_sign($note);
		$update_sql = "UPDATE message SET note='".$note."' WHERE sender=".$sender." AND time=".$time;
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
