<?php
	include 'connect_db.php';
	$res_array = [];
	$email = $_POST['email'];
	$passd = $_POST['passd'];
	$login_type = $_POST['loginType'];
	$device_id = $_POST['deviceId'];
	$login_time = time(); $expire_time = time()+3600*24;
	// if( !isset($_POST['email']) || !isset($_POST['passd'])) { $res_array['error'] = 'No email or password!'; }

	if ($login_type==='employee') {
		$get_sql = "SELECT * FROM employee";
		$result = mysqli_query($conn, $get_sql);
		$login_result = false; $token = "Error email or password"; $emp_info = false;
		if (mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {
				if ($row['email'] === $email && $row['passd'] === $passd) {
					$login_result = true;
					$emp_info = $row;

					$emp_info['passd'] = false;

					$delete_session_sql = "DELETE FROM login_session WHERE device_id='".$device_id."'";
					$delete_result = mysqli_query($conn, $delete_session_sql);

					$token = getRndStr();
					$insert_session_sql = "INSERT INTO login_session (emp_id, device_id, token, login_time, expire_time) VALUES (".$emp_info['id'].", '".$device_id."', '".$token."', ".$login_time.", ".$expire_time.")";
					$insert_result = mysqli_query($conn, $insert_session_sql);
					

					// if ($cur_time < $row['expire'] && $row['device_id'] && $row['device_id'] !== $device_id) {
					// 	$token = "Aleady loggined the account, please use other account!";

					// $update_sql = "UPDATE employee SET other='".$fToken."' WHERE id=".$row["id"];
					// $update_result = mysqli_query($conn, $update_sql);

					// } else {

					// }
				}
			}
		} else {
		}
		echo json_encode((object)['success'=>$login_result, 'token'=>$token, 'empInfo'=>$emp_info, 'insertResult'=>$insert_result]);
	} else if ($login_type === 'service') {
		$get_sql = "SELECT * FROM worker WHERE email='".$email."' AND passd='".$passd."'";
		$result = mysqli_query($conn, $get_sql);
		$main_info = $result->fetch_assoc();

		$login_result = false; $system_array = [];
		if ($main_info) {
			$login_result = true;

			// $get_system_query = "SELECT * FROM system WHERE customer_id=".$main_info['id'];
			// $system_result = mysqli_query($conn, $get_system_query);
		}
		echo json_encode((object)['success'=>$login_result, 'empInfo'=>$main_info, 'systemInfo'=>$system_array]);
	} else {
		$get_sql = "SELECT * FROM customer WHERE passd='".$passd."'";
		$result = mysqli_query($conn, $get_sql);
		$main_info = $result->fetch_assoc();

		$login_result = false; $system_array = [];
		if ($main_info) {
			$login_result = true;

			$get_system_query = "SELECT * FROM system WHERE customer_id=".$main_info['id'];
			$system_result = mysqli_query($conn, $get_system_query);
			// $system_info = $system_result->fetch_assoc();

			// if (mysqli_num_rows($system_result) > 0) {
			// 	while($row = mysqli_fetch_assoc($system_result)) {
			// 		array_push($system_array, (object)[  'id' => $row["id"], 'name' => $row["name"], 'number' => $row["number"], 'customerId' => $row["customer_id"], 'street' => $row["street"], 'canton' => $row["canton"], 'location' => $row["location"], 'zipCode' => $row["zip_code"], 'latitude' => $row["latitude"], 'longitude' => $row["longitude"], 'role'=>$row["role"], 'status'=>$row["status"], 'voltaicBuild'=>$row["voltaic_build"], 'voltaicMat'=>$row["voltaic_mat"], 'pumpBuild'=>$row["pump_build"], 'pumpMat'=>$row["pump_mat"], 'storageBuild'=>$row["storage_build"], 'storageMat'=>$row["storage_mat"], 'chargeBuild'=>$row["charge_build"], 'chargeMat'=>$row["charge_mat"], 'carportMat'=>$row["carport_mat"], 'carportBuild'=>$row["carport_build"], 'lastUpdate'=>$row["last_update"], 'update_time'=>$row["update_time"] ]);
			// 	}
			// }
		}

		echo json_encode((object)['success'=>$login_result, 'empInfo'=>$main_info, 'systemInfo'=>$system_array]);
	}
	
	mysqli_close($conn);
?>