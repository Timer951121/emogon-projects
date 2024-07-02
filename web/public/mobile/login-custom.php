<?php
	include '../other/connect_db.php';
	$_POST = json_decode(file_get_contents("php://input"), true);
	$res_array = []; $passd = $_POST['passd']; $token = $_POST['token'];

	$app_sql = "SELECT * FROM app_info WHERE id=1";
	$app_result = mysqli_query($conn, $app_sql);
	$app_info = [];
	if ($app_result) {
		$app_info = $app_result->fetch_assoc();
	}

	$get_sql = "SELECT * FROM customer WHERE passd='".$passd."'";
	$result = mysqli_query($conn, $get_sql);
	$main_info = $result->fetch_assoc();

	$login_result = false; $system_array = []; $service_array = [];
	if ($main_info) {
		$login_result = true;
		$login_time = time();
		if ($token) {
			$update_sql = "UPDATE customer SET other='".$token."', last_login=".$login_time." WHERE passd='".$passd."'";
			$update_result = mysqli_query($conn, $update_sql);
		}

		$get_system_query = "SELECT * FROM system WHERE customer_id=".$main_info['id'];
		$system_result = mysqli_query($conn, $get_system_query);
		// $system_info = $system_result->fetch_assoc();

		if (mysqli_num_rows($system_result) > 0) {
			while($row = mysqli_fetch_assoc($system_result)) {
				array_push($system_array, (object)[  'id' => $row["id"], 'name' => $row["name"], 'number' => $row["number"], 'customerId' => $row["customer_id"], 'street' => $row["street"], 'canton' => $row["canton"], 'location' => $row["location"], 'zipCode' => $row["zip_code"], 'latitude' => $row["latitude"], 'longitude' => $row["longitude"], 'role'=>$row["role"], 'status'=>$row["status"], 'voltaicBuild'=>$row["voltaic_build"], 'voltaicMat'=>$row["voltaic_mat"], 'pumpBuild'=>$row["pump_build"], 'pumpMat'=>$row["pump_mat"], 'storageBuild'=>$row["storage_build"], 'storageMat'=>$row["storage_mat"], 'chargeBuild'=>$row["charge_build"], 'chargeMat'=>$row["charge_mat"], 'carportMat'=>$row["carport_mat"], 'carportBuild'=>$row["carport_build"], 'lastUpdate'=>$row["last_update"], 'update_time'=>$row["update_time"] ]);
			}
		}

		$get_service_query = "SELECT * FROM service WHERE customer_id=".$main_info['id'];
		$service_result = mysqli_query($conn, $get_service_query);

		if (mysqli_num_rows($service_result) > 0) {
			while($row = mysqli_fetch_assoc($service_result)) {
				array_push($service_array, (object)[ 'id' => $row["id"], 'customerId' => $row["customer_id"], 'systemId' => $row["system_id"], 'mainType' => $row["main_type"], 'subType' => $row["sub_type"], 'content' => $row["content"], 'time' => $row["time"] ] );
			}
		}
	}

	echo json_encode((object)['success'=>$login_result, 'mainInfo'=>$main_info, 'systemInfo'=>$system_array, 'serviceInfo'=>$service_array, 'appVersion'=>$app_info['mobile_version']]);
	mysqli_close($conn);
?>