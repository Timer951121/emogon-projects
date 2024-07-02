<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$emp_id = $_POST['empId'];
	$ticket_id = $_POST['ticketId'];
	$time_pass = $_POST['time'];
	
	if ($time_pass == 0) {
		$sql = "SELECT * FROM message WHERE ticket_id=".$ticket_id;
	} else {
		$sql = "SELECT * FROM message WHERE ticket_id=".$ticket_id." and time > ".$time_pass." and sender != ".$emp_id;
	}

	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$content = change_sign_str($row["content"]);
			$note = change_sign_str($row["note"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'time' => $row["time"], 'content' => $content, 'note' => $note, 'sender' => $row["sender"], 'customer' => $row["customer"], 'messageType' => $row["other"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>