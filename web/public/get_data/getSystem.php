<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$sql = "SELECT * FROM system";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$name = change_sign_str($row["name"]);
			$street = change_sign_str($row["street"]);
			$canton = change_sign_str($row["canton"]);
			$location = change_sign_str($row["location"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'name' => $name, 'customerId' => $row["customer_id"], 'number'=>$row["number"], 'street' => $street, 'canton' => $canton, 'location' => $location, 'zipCode' => $row["zip_code"], 'role'=>$row["role"], 'status'=>$row["status"], 'voltaicBuild'=>$row["voltaic_build"], 'voltaicMat'=>$row["voltaic_mat"], 'pumpBuild'=>$row["pump_build"], 'pumpMat'=>$row["pump_mat"], 'storageBuild'=>$row["storage_build"], 'storageMat'=>$row["storage_mat"], 'chargeBuild'=>$row["charge_build"], 'chargeMat'=>$row["charge_mat"], 'carportMat'=>$row["carport_mat"], 'carportBuild'=>$row["carport_build"], 'update_time'=>$row["update_time"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>