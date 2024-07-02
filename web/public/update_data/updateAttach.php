<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	if(isset($_FILES['file']['name'])){
		$serverPath = dirname(__FILE__);
		
		$filename = $_FILES['file']['name']; $new_name = (string)time(); // $_POST['fileName'];
		$location = $serverPath."/images//".$new_name.'.jpg'; // $filename;
	
		$file_name = '';
		if(move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
			$file_name = $new_name;
		}
		$server_ip = $_SERVER['SERVER_ADDR'];
		// echo $file_name;
		echo json_encode((object)['file_name'=>$file_name]);
		exit;
	}

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$name = $_POST['name'];
	$number = $_POST['number'];
	$format = $_POST['format'];

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
				$update_sql = "UPDATE system SET name='".$name."', street='".$street."', canton='".$canton."', location='".$location."', role=".$role.", update_time=".$update_time." WHERE id=".$id;
			} else {
				$update_sql = "UPDATE system SET voltaic_build='".$voltaic_build."', voltaic_mat='".$voltaic_mat."', pump_build='".$pump_build."', pump_mat='".$pump_mat."', storage_build='".$storage_build."', storage_mat='".$storage_mat."', charge_build='".$charge_build."', charge_mat='".$charge_mat."', carport_build='".$carport_build."', carport_mat='".$carport_mat."', update_time=".$update_time." WHERE id=".$id;
			}
		} else {
			$update_sql = "INSERT INTO system (name, number, customer_id, street, canton, location, role, update_time) VALUES ('".$name."', '".$number."', ".$customer_id.", '".$street."', '".$canton."', '".$location."', ".$role.", ".$update_time.")";
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error]);
	mysqli_close($conn);
?>
