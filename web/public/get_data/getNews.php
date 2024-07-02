<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';
	
	$sql = "SELECT * FROM news";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$title = change_sign_str($row["title"]);
			$description = change_sign_str($row["description"]);
			array_push($res_array, (object)[ 'id' => $row["id"], 'title' => $title, 'description' => $description, 'image' => $row["image"], 'time' => $row["time"] ]);
		}
	} else {
	}
	// echo json_encode((object)['success'=>true, 'token'=>$token, 'data'=>$update_result, 'test'=>false]);
	echo json_encode($res_array);
	mysqli_close($conn);
?>