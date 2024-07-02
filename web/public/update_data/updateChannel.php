<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$senderId = $_POST['senderId'];
	$receiverId = $_POST['receiverId'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$time = $_POST['time'];

	$title = change_str_sign($title);
	$description = change_str_sign($description);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM channel WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE channel SET update_time=".$time." WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO channel (title, sender_id, receiver_id, description, create_time, update_time) VALUES ('".$title."', ".$senderId.", ".$receiverId.", '".$description."', ".$time.", ".$time.")";
			$update_type = 'create';
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);

		if ($update_type === 'create') {
			$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM channel");
			$row = mysqli_fetch_row($max_id_result);
			$max_id = $row[0];

			$insert_mail_sql = "INSERT INTO mail (channel_id, sender_id, receiver_id, content, time) VALUES (".$max_id.", ".$senderId.", ".$receiverId.", '".$description."', ".$time.")";
			$insert_mail = mysqli_query($conn, $insert_mail_sql);

		} else if ($update_type === 'delete') {
			$delete_mail_sql = "DELETE FROM mail WHERE channel_id=".$id;
			$delete_mail = mysqli_query($conn, $delete_mail_sql);
		}
	} else if ($update_error) {
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error]);
	mysqli_close($conn);
?>
