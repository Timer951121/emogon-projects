<?php
	include '../other/connect_db.php';
	$_POST = json_decode(file_get_contents("php://input"), true);
	$res_array = []; $email = $_POST['email']; $passd = $_POST['passd'];

	$app_sql = "SELECT * FROM app_info WHERE id=1";
	$app_result = mysqli_query($conn, $app_sql);
	$app_info = [];
	if ($app_result) {
		$app_info = $app_result->fetch_assoc();
	}

	$get_sql = "SELECT * FROM worker WHERE passd='".$passd."' AND email='".$email."'";
	$result = mysqli_query($conn, $get_sql);
	$main_info = $result->fetch_assoc();

	$login_result = false; $customer_array = []; $system_array = [];
	if ($main_info) {
		$login_result = true;
		$login_time = time();

		$get_customer_query = "SELECT * FROM customer";
		$customer_result = mysqli_query($conn, $get_customer_query);
		// $customer_info = $customer_result->fetch_assoc();

		if (mysqli_num_rows($customer_result) > 0) {
			while($row = mysqli_fetch_assoc($customer_result)) {
				array_push($customer_array, (object)[  'id' => $row["id"], 'email' => $row["email"], 'first' => $row["first"], 'last' => $row["last"], 'company' => $row["company"], 'street' => $row["street"], 'canton' => $row["canton"], 'location' => $row["location"] ]);
			}
		}

		$get_system_query = "SELECT * FROM system";
		$system_result = mysqli_query($conn, $get_system_query);
		// $system_info = $system_result->fetch_assoc();

		if (mysqli_num_rows($system_result) > 0) {
			while($row = mysqli_fetch_assoc($system_result)) {
				array_push($system_array, (object)[  'id' => $row["id"], 'name' => $row["name"], 'number' => $row["number"], 'customerId' => $row["customer_id"], 'street' => $row["street"], 'canton' => $row["canton"], 'location' => $row["location"], 'zipCode' => $row["zip_code"], 'latitude' => $row["latitude"], 'longitude' => $row["longitude"], 'role'=>$row["role"], 'voltaicBuild'=>$row["voltaic_build"], 'voltaicMat'=>$row["voltaic_mat"], 'pumpBuild'=>$row["pump_build"], 'pumpMat'=>$row["pump_mat"], 'storageBuild'=>$row["storage_build"], 'storageMat'=>$row["storage_mat"], 'chargeBuild'=>$row["charge_build"], 'chargeMat'=>$row["charge_mat"], 'carportMat'=>$row["carport_mat"], 'carportBuild'=>$row["carport_build"], 'lastUpdate'=>$row["last_update"], 'update_time'=>$row["update_time"] ]);
			}
		}
	}

	echo json_encode((object)['success'=>$login_result, 'mainInfo'=>$main_info, 'customerInfo'=>$customer_array, 'systemInfo'=>$system_array, 'appVersion'=>$app_info['mobile_version']]);
	mysqli_close($conn);
?>