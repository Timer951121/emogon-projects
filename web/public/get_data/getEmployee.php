<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$sql = "SELECT * FROM employee";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$first = change_sign_str($row["first"]);
			$last = change_sign_str($row["last"]);
			$branch = change_sign_str($row["branch"]);
			$street = change_sign_str($row["street"]);
			$canton = change_sign_str($row["canton"]);
			$address = change_sign_str($row["address"]);

			array_push($res_array, (object)[ 'id' => $row["id"], 'first' => $first, 'last' => $last, 'email' => $row["email"], 'passd' => $row["passd"], 'branch'=>$branch, 'depart'=>$row["depart"], 'role'=>$row["role"], 'street'=>$street, 'canton' => $canton, 'address'=>$address, 'employee_id'=>$row["employee_id"], 'other'=>$row["other"], 'image'=>$row["image"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>