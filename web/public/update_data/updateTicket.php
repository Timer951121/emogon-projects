<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$loginType = $_POST['loginType'];
	$id = $_POST['id'];
	$customerId = $_POST['customerId'];
	$systemId = $_POST['systemId'];
	$number = $_POST['number'];
	$category = $_POST['category'];
	$title = $_POST['title'];
	$employeeId = $_POST['employeeId'];
	$description = $_POST['description'];
	$status = $_POST['status'];
	$time = $_POST['time'];
	$create_time = $_POST['createTime'];

	$title = change_str_sign($title);
	$description = change_str_sign($description);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM ticket WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE ticket SET time=".$time." WHERE id=".$id;
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
			$sender_id = $employeeId;
			$customer_val = 0;
			if ($loginType==='customer') {
				$sender_id = $customerId;
				$customer_val = 1;
			}

			$insert_message_sql = "INSERT INTO message (time, system_id, ticket_id, customer, sender, content) VALUES (".$create_time.", ".$systemId.", ".$max_id.", ".$customer_val.", ".$sender_id.", '".$description."')";
			$insert_message = mysqli_query($conn, $insert_message_sql);

		} else if ($update_type === 'delete') {
			$delete_message_sql = "DELETE FROM message WHERE ticket_id=".$id;
			$delete_message = mysqli_query($conn, $delete_message_sql);
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error]);
	mysqli_close($conn);
?>
