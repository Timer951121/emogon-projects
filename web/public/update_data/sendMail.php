<?php

	require '../vendor/autoload.php';
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$channel_id = $_POST['channelId'];
	$sender_id = $_POST['senderId'];
	$receiver_id = $_POST['receiverId'];
	$content = $_POST['content'];
	$time = $_POST['time'];
	$other = $_POST['mailType'];

	$content = change_str_sign($content);

	$insert_sql = "INSERT INTO mail (time, channel_id, sender_id, receiver_id, content, other) VALUES (".$time.", ".$channel_id.", ".$sender_id.", ".$receiver_id.", '".$content."', '".$other."')";

	$insert_result = mysqli_query($conn, $insert_sql);

	$status_sql = "UPDATE channel SET update_time=".$time." WHERE id=".$channel_id;
	$status_result = mysqli_query($conn, $status_sql);

	echo json_encode((object)['success'=>$insert_result]);

	mysqli_close($conn);
?>
