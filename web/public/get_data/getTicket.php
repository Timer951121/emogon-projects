<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';
	
	$sql = "SELECT * FROM ticket";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$title = change_sign_str($row["title"]);
			$description = change_sign_str($row["description"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'customerId'=>$row["customer_id"], 'systemId'=>$row["system_id"], 'category'=>$row["category"], 'number'=>$row["number"], 'employeeId'=>$row["employee_id"], 'title' => $title, 'description' => $description, 'status' => $row["status"], 'lastTime' => $row["last_time"], 'readTime' => $row["read_time"], 'createTime' => $row["create_time"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>