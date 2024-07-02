<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$name = $_POST['name'];
	$number = $_POST['number'];
	$street = $_POST['street'];
	$canton = $_POST['canton'];
	$location = $_POST['location'];
	$latitude = $_POST['latitude'];
	$longitude = $_POST['longitude'];
	$zip_code = $_POST['zipCode'];
	$role = $_POST['role'];
	$status = $_POST['status'];
	$customer_id = $_POST['customerId'];
	$voltaic_build = $_POST['voltaicBuild'];
	$voltaic_mat = $_POST['voltaicMat'];
	$pump_build = $_POST['pumpBuild'];
	$pump_mat = $_POST['pumpMat'];
	$storage_build = $_POST['storageBuild'];
	$storage_mat = $_POST['storageMat'];
	$charge_build = $_POST['chargeBuild'];
	$charge_mat = $_POST['chargeMat'];
	$carport_build = $_POST['carportBuild'];
	$carport_mat = $_POST['carportMat'];
	$last_update = $_POST['lastUpdate'];
	$update_time = time();

	$name = change_str_sign($name);
	$street = change_str_sign($street);
	$canton = change_str_sign($canton);
	$location = change_str_sign($location);

	$update_error = ""; $token = false;
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM system WHERE id=".$id;
	} else {
		if ($id) {
			if ($update_type === 'main') {
				$update_sql = "UPDATE system SET name='".$name."', number='".$number."', street='".$street."', canton='".$canton."', location='".$location."', zip_code='".$zip_code."', latitude=".$latitude.", longitude=".$longitude.", role=".$role.", update_time=".$update_time." WHERE id=".$id;
			} else {
				$update_sql = "UPDATE system SET status=".$status.", voltaic_build='".$voltaic_build."', voltaic_mat='".$voltaic_mat."', pump_build='".$pump_build."', pump_mat='".$pump_mat."', storage_build='".$storage_build."', storage_mat='".$storage_mat."', charge_build='".$charge_build."', charge_mat='".$charge_mat."', carport_build='".$carport_build."', carport_mat='".$carport_mat."', last_update='".$last_update."', update_time=".$update_time." WHERE id=".$id;
			}
			
		} else {
			// $get_same_name = mysqli_query($conn, "SELECT id FROM system WHERE name='".$name."'");
			// $row = mysqli_fetch_row($get_same_name);
			// $lengths = mysqli_fetch_lengths($get_same_name);
			// if ($lengths) $count = count($lengths);
			// if ($count && $count > 0) {
			// 	$update_error = "Already exist the name";
			// } else {
				$update_sql = "INSERT INTO system (name, number, customer_id, street, canton, location, zip_code, latitude, longitude, role, status, update_time) VALUES ('".$name."', '".$number."', ".$customer_id.", '".$street."', '".$canton."', '".$location."', '".$zip_code."', ".$latitude.", ".$longitude.", ".$role.", 0, ".$update_time.")";
			// }
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);

		$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM system");
		$row = mysqli_fetch_row($max_id_result);
		$max_id = $row[0];

		if ($update_type === 'delete') {
			$remove_ticket = "DELETE FROM ticket WHERE system_id=".$id;
			mysqli_query($conn, $remove_ticket);
			$remove_message = "DELETE FROM message WHERE system_id=".$id;
			mysqli_query($conn, $remove_message);
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error, 'maxId'=>$max_id]);
	mysqli_close($conn);
?>
