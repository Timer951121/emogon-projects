<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$sql = "SELECT * FROM company";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$name = change_sign_str($row["name"]);
			$street = change_sign_str($row["street"]);
			$canton = change_sign_str($row["canton"]);
			$location = change_sign_str($row["location"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'name' => $name, 'street' => $street, 'canton' => $canton, 'location' => $location, 'role'=>$row["role"], 'other'=>$row["other"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>