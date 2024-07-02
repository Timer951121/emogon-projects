<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$technical_id = $_POST['technicalId'];
	$value = $_POST['value'];

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM technical WHERE id=".$technical_id;
	} else {
		$update_sql = "UPDATE technical SET real_name=".$value." WHERE id=".$technical_id;
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
	}

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>
