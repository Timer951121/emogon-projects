<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$_POST = json_decode(file_get_contents("php://input"), true);

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$customerId = $_POST['customerId'];
	$systemId = $_POST['systemId'];
	$number = $_POST['number'];
	$category = $_POST['category'];
	$title = $_POST['title'];
	$employeeId = $_POST['employeeId'];
	$description = $_POST['description'];
	$status = $_POST['status'];
	$create_time = $_POST['createTime'];
	$time = $_POST['time'];

	$title = change_str_sign($title);
	$description = change_str_sign($description);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM ticket WHERE id=".$id;
	} else {
		if ($id) {
			// $update_sql = "UPDATE ticket SET time=".$time." WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO ticket (customer_id, system_id, number, category, title, employee_id, description, status, create_time, last_time) VALUES (".$customerId.", ".$systemId.", '".$number."', '".$category."', '".$title."', ".$employeeId.", '".$description."', 'new', ".$create_time.", ".$create_time.")";
			$update_type = 'create';
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
		if ($update_type === 'create') {
			$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM ticket");
			$row = mysqli_fetch_row($max_id_result);
			$max_id = $row[0];

			$insert_message_sql = "INSERT INTO message (time, system_id, ticket_id, sender, customer, content) VALUES (".$create_time.", ".$systemId.", ".$max_id.", ".$customerId.", 1, '".$description."')";
			$insert_message = mysqli_query($conn, $insert_message_sql);
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error]);
	mysqli_close($conn);
?>
