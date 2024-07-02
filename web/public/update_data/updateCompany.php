<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$name = $_POST['name'];
	$street = $_POST['street'];
	$canton = $_POST['canton'];
	$location = $_POST['location'];
	$role = $_POST['role'];

	$name = change_str_sign($name);
	$street = change_str_sign($street);
	$canton = change_str_sign($canton);
	$location = change_str_sign($location);

	$update_error = ""; $token = false;
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM company WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE company SET name='".$name."', street='".$street."', canton='".$canton."', location='".$location."', role=".$role." WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO company (name, street, canton, location, role) VALUES ('".$name."', '".$street."', '".$canton."', '".$location."', ".$role.")";
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);

		$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM company");
		$row = mysqli_fetch_row($max_id_result);
		$max_id = $row[0];

		if ($update_type === 'delete') {
			$remove_worker = "DELETE FROM worker WHERE company_id=".$id;
			mysqli_query($conn, $remove_worker);
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error, 'maxId'=>$max_id]);
	mysqli_close($conn);
?>
