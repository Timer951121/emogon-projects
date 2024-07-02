<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$first = $_POST['first'];
	$last = $_POST['last'];
	$company_id = $_POST['companyId'];
	$email = $_POST['email'];
	$passd = $_POST['passd'];
	$street = $_POST['street'];
	$canton = $_POST['canton'];
	$location = $_POST['location'];
	$image = $_POST['image'];

	$first = change_str_sign($first);
	$last = change_str_sign($last);
	$company = change_str_sign($company);
	$street = change_str_sign($street);
	$canton = change_str_sign($canton);
	$location = change_str_sign($location);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM worker WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE worker SET first='".$first."', last='".$last."', company_id='".$company_id."', email='".$email."', passd='".$passd."', street='".$street."', canton='".$canton."', location='".$location."', image='".$image."' WHERE id=".$id;
		} else {
			$get_same_email = mysqli_query($conn, "SELECT id FROM worker WHERE email='".$email."'");
			$row = mysqli_fetch_row($get_same_email);
			$lengths = mysqli_fetch_lengths($get_same_email);
			if ($lengths) $count = count($lengths);
			if ($count && $count > 0) {
				$update_error = "Already exist the email";
			} else {
				$update_sql = "INSERT INTO worker (first, last, company_id, email, passd, street, canton, location, image) VALUES ('".$first."', '".$last."', ".$company_id.", '".$email."', '".$passd."', '".$street."', '".$canton."', '".$location."', '".$image."')";
			}
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);

		$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM worker");
		$row = mysqli_fetch_row($max_id_result);
		$max_id = $row[0];

		if ($update_type === 'delete') {
			// $remove_system = "DELETE FROM system WHERE worker_id=".$id;
			// mysqli_query($conn, $remove_system);
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error, 'maxId'=>$max_id]);
	mysqli_close($conn);
?>
