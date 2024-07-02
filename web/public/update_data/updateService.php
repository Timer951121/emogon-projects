<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$customerId = $_POST['customerId'];
	$systemId = $_POST['systemId'];
	$main_type = $_POST['mainType'];
	$sub_type = $_POST['subType'];
	$content = $_POST['content'];
	$time = $_POST['time'];

	$description = change_str_sign($description);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM service WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE service SET time=".$time." WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO service (customer_id, system_id, main_type, sub_type, content, time) VALUES (".$customerId.", ".$systemId.", '".$main_type."', '".$sub_type."', '".$content."', ".$time.")";
			$update_type = 'create';
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);

		if ($update_type === 'create') {
			$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM service");
			$row = mysqli_fetch_row($max_id_result);
			$max_id = $row[0];
		} else if ($update_type === 'delete') {
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error]);
	mysqli_close($conn);
?>
