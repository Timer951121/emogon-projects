<?php
	include '../other/connect_db.php';
	$id = $_POST['id'];
	$voltaic_mat = $_POST['voltaicMat'];
	$pump_mat = $_POST['pumpMat'];
	$storage_mat = $_POST['storageMat'];
	$charge_mat = $_POST['chargeMat'];
	$voltaic_build = $_POST['voltaicBuild'];
	$pump_build = $_POST['pumpBuild'];
	$storage_build = $_POST['storageBuild'];
	$charge_build = $_POST['chargeBuild'];

	$carport_mat = $_POST['carportMat'];
	$carport_build = $_POST['carportBuild'];

	$update_time = time();

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM module WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE module SET voltaic_mat='".$voltaic_mat."', pump_mat='".$pump_mat."', storage_mat='".$storage_mat."', charge_mat='".$charge_mat."', voltaic_build='".$voltaic_build."', pump_build='".$pump_build."', storage_build='".$storage_build."', charge_build='".$charge_build."', carport_mat='".$carport_mat."', carport_build='".$carport_build."', update_time=".$update_time." WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO module (voltaic_mat, pump_mat, storage_mat, charge_mat, voltaic_build, pump_build, storage_build, charge_build, carport_mat, carport_build, update_time) VALUES ('".$voltaic_mat."', '".$pump_mat."', '".$storage_mat."', '".$charge_mat."', '".$voltaic_build."', '".$pump_build."', '".$storage_build."', '".$charge_build."', '".$carport_mat."', '".$carport_build."', ".$update_time.")";
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
