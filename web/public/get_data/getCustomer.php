<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$sql = "SELECT * FROM customer";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$first = change_sign_str($row["first"]);
			$last = change_sign_str($row["last"]);
			$company = change_sign_str($row["company"]);
			$street = change_sign_str($row["street"]);
			$canton = change_sign_str($row["canton"]);
			$location = change_sign_str($row["location"]);

			array_push($res_array, (object)[ 'id' => $row["id"], 'first' => $first, 'last' => $last, 'email' => $row["email"], 'passd' => $row["passd"], 'company' => $company, 'street'=>$street, 'zipCode'=>$row["zip_code"], 'canton' => $canton, 'location'=>$location, 'tel1'=>$row["tel_1"], 'tel2'=>$row["tel_2"], 'lastLogin'=>$row["last_login"], 'image'=>$row["image"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>