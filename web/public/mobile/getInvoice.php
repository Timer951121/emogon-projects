<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$_POST = json_decode(file_get_contents("php://input"), true);

	$system_id = $_POST['systemId'];
	
	$sql = "SELECT * FROM invoice WHERE system_id=".$system_id;
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			array_push($res_array, (object)[ 'id' => $row["id"], 'customerId'=>$row["customer_id"], 'systemId'=>$row["system_id"], 'part'=>$row["part"], 'name'=>$row["name"], 'time'=>$row["time"], 'paid' => $row["paid"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>