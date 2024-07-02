<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';
	
	$sql = "SELECT * FROM service";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$title = change_sign_str($row["title"]);
			$content = change_sign_str($row["content"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'customerId'=>$row["customer_id"], 'systemId'=>$row["system_id"], 'mainType'=>$row["main_type"], 'subType'=>$row["sub_type"],'content' => $content, 'time' => $row["time"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>