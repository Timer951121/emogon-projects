<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$first = $_POST['first'];
	$last = $_POST['last'];
	$company = $_POST['company'];
	$email = $_POST['email'];
	$passd = $_POST['passd'];
	$street = $_POST['street'];
	$canton = $_POST['canton'];
	$location = $_POST['location'];
	$tel_1 = $_POST['tel1'];
	$tel_2 = $_POST['tel2'];
	$zip_code = $_POST['zipCode'];
	// $latitude = $_POST['lat'];
	// $longitude = $_POST['lng'];
	$image = $_POST['image'];

	$first = change_str_sign($first);
	$last = change_str_sign($last);
	$company = change_str_sign($company);
	$street = change_str_sign($street);
	$canton = change_str_sign($canton);
	$location = change_str_sign($location);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM customer WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE customer SET first='".$first."', last='".$last."', company='".$company."', email='".$email."', passd='".$passd."', street='".$street."', zip_code='".$zip_code."', canton='".$canton."', location='".$location."', tel_1='".$tel_1."', tel_2='".$tel_2."', image='".$image."' WHERE id=".$id; // , latitude=".$latitude.", longitude=".$longitude."
		} else {
			$get_same_email = mysqli_query($conn, "SELECT id FROM customer WHERE email='".$email."'");
			$row = mysqli_fetch_row($get_same_email);
			$lengths = mysqli_fetch_lengths($get_same_email);
			if ($lengths) $count = count($lengths);
			if ($count && $count > 0) {
				$update_error = "Already exist the email";
			} else {
				$update_sql = "INSERT INTO customer (first, last, company, email, passd, street, zip_code, canton, location, tel_1, tel_2, image) VALUES ('".$first."', '".$last."', '".$company."', '".$email."', '".$passd."', '".$street."', '".$zip_code."', '".$canton."', '".$location."', '".$tel_1."', '".$tel_2."', '".$image."')"; // , latitude, longitude , ".$latitude.", ".$longitude."
			}
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);

		$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM customer");
		$row = mysqli_fetch_row($max_id_result);
		$max_id = $row[0];

		if ($update_type === 'delete') {
			$remove_system = "DELETE FROM system WHERE customer_id=".$id;
			mysqli_query($conn, $remove_system);
			$remove_service = "DELETE FROM service WHERE customer_id=".$id;
			mysqli_query($conn, $remove_service);
			$remove_ticket = "DELETE FROM ticket WHERE customer_id=".$id;
			mysqli_query($conn, $remove_ticket);
		}
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error, 'maxId'=>$max_id]);
	mysqli_close($conn);
?>
