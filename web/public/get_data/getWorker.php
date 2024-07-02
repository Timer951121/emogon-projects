<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$sql = "SELECT * FROM worker";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$first = change_sign_str($row["first"]);
			$last = change_sign_str($row["last"]);
			$street = change_sign_str($row["street"]);
			$canton = change_sign_str($row["canton"]);
			$location = change_sign_str($row["location"]);
			$passd = change_sign_str($row["passd"]);

			array_push($res_array, (object)[ 'id' => $row["id"], 'first' => $first, 'last' => $last, 'email' => $row["email"], 'passd' => $passd, 'companyId' => $row["company_id"], 'street'=>$street, 'canton' => $canton, 'location'=>$location, 'image'=>$row["image"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>