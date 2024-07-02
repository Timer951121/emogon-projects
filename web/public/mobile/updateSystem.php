<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$_POST = json_decode(file_get_contents("php://input"), true);

	$id = $_POST['id'];
	$main_key = $_POST['mainKey'];
	$sub_key = $_POST['subKey'];
	$str = $_POST['str'];

	$description = change_str_sign($description);

	$update_error = "";

	if ($main_key==='voltaic') {
		if ($sub_key==='Build') {
			$update_sql = "UPDATE system SET voltaic_build='".$str."' WHERE id=".$id;
		} else if ($sub_key==='Mat') {
			$update_sql = "UPDATE system SET voltaic_mat='".$str."' WHERE id=".$id;
		}
	} else if ($main_key==='pump') {
		if ($sub_key==='Build') {
			$update_sql = "UPDATE system SET pump_build='".$str."' WHERE id=".$id;
		} else if ($sub_key==='Mat') {
			$update_sql = "UPDATE system SET pump_mat='".$str."' WHERE id=".$id;
		}
	} else if ($main_key==='storage') {
		if ($sub_key==='Build') {
			$update_sql = "UPDATE system SET storage_build='".$str."' WHERE id=".$id;
		} else if ($sub_key==='Mat') {
			$update_sql = "UPDATE system SET storage_mat='".$str."' WHERE id=".$id;
		}
	} else if ($main_key==='charge') {
		if ($sub_key==='Build') {
			$update_sql = "UPDATE system SET charge_build='".$str."' WHERE id=".$id;
		} else if ($sub_key==='Mat') {
			$update_sql = "UPDATE system SET charge_mat='".$str."' WHERE id=".$id;
		}
	} else if ($main_key==='carport') {
		if ($sub_key==='Build') {
			$update_sql = "UPDATE system SET carport_build='".$str."' WHERE id=".$id;
		} else if ($sub_key==='Mat') {
			$update_sql = "UPDATE system SET carport_mat='".$str."' WHERE id=".$id;
		}
	}

	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error]);
	mysqli_close($conn);
?>
