<?php

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$first = $_POST['first'];
	$last = $_POST['last'];
	$email = $_POST['email'];
	$passd = $_POST['passd'];
	$branch = $_POST['branch'];
	$depart = $_POST['depart'];
	$role = $_POST['role'];
	$street = $_POST['street'];
	$canton = $_POST['canton'];
	$address = $_POST['address'];
	$employee_id = $_POST['employee_id'];
	$image = $_POST['image'];

	$first = change_str_sign($first);
	$last = change_str_sign($last);
	$street = change_str_sign($street);
	$canton = change_str_sign($canton);
	$address = change_str_sign($address);
	

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM employee WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE employee SET first='".$first."', last='".$last."', email='".$email."', passd='".$passd."', branch='".$branch."', depart='".$depart."', role='".$role."', street='".$street."', canton='".$canton."', address='".$address."', image='".$image."' WHERE id=".$id; // , employee_id='".$employee_id."'
			// print_r($update_sql);
		} else {
			$get_same_email = mysqli_query($conn, "SELECT id FROM employee WHERE email='".$email."'");
			$row = mysqli_fetch_row($get_same_email);
			$lengths = mysqli_fetch_lengths($get_same_email);
			if ($lengths) $count = count($lengths);
			if ($count && $count > 0) {
				$update_error = "Already exist the email";
			} else {
				$update_sql = "INSERT INTO employee (first, last, email, passd, branch, depart, role, street, canton, address, employee_id, image) VALUES ('".$first."', '".$last."', '".$email."', '".$passd."', '".$branch."', '".$depart."', '".$role."', '".$street."', '".$canton."', '".$address."', '".$employee_id."', '".$image."')";
			}
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

