<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$_POST = json_decode(file_get_contents("php://input"), true);
	
	$customer_id = $_POST['customerId'];
	$ticket_id = $_POST['ticketId'];
	$time_pass = $_POST['time'];
	
	if ($time_pass == 0) {
		$sql = "SELECT * FROM message WHERE ticket_id=".$ticket_id;
	} else {
		$sql = "SELECT * FROM message WHERE ticket_id=".$ticket_id." and time > ".$time_pass." and sender != ".$customer_id;
	}

	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$content = change_sign_str($row["content"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'time' => $row["time"], 'content' => $content, 'sender' => $row["sender"], 'customer' => $row["customer"], 'messageType' => $row["other"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);

	$time = time();
	$update_ticket_sql = "UPDATE ticket SET read_time=".$time." WHERE id=".$ticket_id;
	$update_ticket_result = mysqli_query($conn, $update_ticket_sql);

	echo json_encode($res_array);
	mysqli_close($conn);
?>