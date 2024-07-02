<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$emp_id = $_POST['empId'];
	$channel_id = $_POST['channelId'];
	$time_pass = $_POST['time'];

	if (!$channel_id) {
		$sql = "SELECT * FROM mail";
	} else if ($time_pass == 0) {
		$sql = "SELECT * FROM mail WHERE channel_id=".$channel_id;
	} else {
		$sql = "SELECT * FROM mail WHERE channel_id=".$channel_id." and time > ".$time_pass." and sender_id != ".$emp_id;
	}

	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$content = change_sign_str($row["content"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'channelId' => $row["channel_id"], 'content' => $content, 'senderId' => $row["sender_id"], 'receiverId' => $row["receiver_id"], 'time' => $row["time"], 'other' => $row["other"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>