<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$_POST = json_decode(file_get_contents("php://input"), true);

	$system_id = $_POST['systemId'];
	$ticket_id = $_POST['ticketId'];
	$sender = $_POST['sender'];
	$content = $_POST['content'];
	$time = $_POST['time'];
	$other = null;
	if ($_POST['messageType']) $other = $_POST['messageType'];

	$content = change_str_sign($content);

	$insert_sql = "INSERT INTO message (time, system_id, ticket_id, sender, customer, content, other) VALUES (".$time.", ".$system_id.", ".$ticket_id.", ".$sender.", 1, '".$content."', '".$other."')";

	$insert_result = mysqli_query($conn, $insert_sql);

	$status_sql = "UPDATE ticket SET status='client', last_time=".$time." WHERE id=".$ticket_id;
	$status_result = mysqli_query($conn, $status_sql);

	echo json_encode((object)['success'=>$insert_result]);
	mysqli_close($conn);
?>
