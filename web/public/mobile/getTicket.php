<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$_POST = json_decode(file_get_contents("php://input"), true);

	$system_id = $_POST['systemId'];
	
	$sql = "SELECT * FROM ticket WHERE system_id=".$system_id;
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$title = change_sign_str($row["title"]);
			$description = change_sign_str($row["description"]);

			$read_time = 0;
			if ($row["read_time"]) $read_time = $row["read_time"];

			$unread_message_sql = "SELECT * FROM message WHERE ticket_id=".$row["id"]." AND time > ".$read_time;
			$unread_message_result = mysqli_query($conn, $unread_message_sql);
			$unread_count = mysqli_num_rows($unread_message_result);

			array_push($res_array, (object)[ 'id' => $row["id"], 'customerId'=>$row["customer_id"], 'systemId'=>$row["system_id"], 'category'=>$row["category"], 'number'=>$row["number"], 'employeeId'=>$row["employee_id"], 'title' => $title, 'description' => $description, 'status' => $row["status"], 'lastTime' => $row["last_time"], 'readTime' => $row["read_time"], 'createTime' => $row["create_time"], 'unRead' => $unread_count ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>