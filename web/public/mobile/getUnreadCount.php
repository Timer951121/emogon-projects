<?php
	include '../other/connect_db.php';

	$_POST = json_decode(file_get_contents("php://input"), true);

	$system_id = $_POST['systemId'];
	
	$ticket_list_sql = "SELECT * FROM ticket WHERE system_id=".$system_id;
	$ticket_list_result = mysqli_query($conn, $ticket_list_sql);

	$unread_count = 0;
	if (mysqli_num_rows($ticket_list_result) > 0) {
		while($ticket_row = mysqli_fetch_assoc($ticket_list_result)) {
			$ticket_id = $ticket_row['id'];
			$read_time = $ticket_row['read_time'] || 0;
			$unread_message_sql = "SELECT * FROM message WHERE ticket_id=".$ticket_id." AND time > ".$read_time;
			$unread_message_result = mysqli_query($conn, $unread_message_sql);
			$unread_message = mysqli_num_rows($unread_message_result);
			$unread_count += $unread_message;
		}
	} else {
	}
	echo json_encode((object)['success'=>true, 'unread_count'=>$unread_count]);
	// echo json_encode($unread_count);
	mysqli_close($conn);
?>