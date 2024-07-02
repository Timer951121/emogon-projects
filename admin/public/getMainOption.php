<?php
	header('Content-Type: application/json; charset=UTF-8');
	$res_array = []; $email = $_POST['email']; $token = $_POST['token']; $curTime = $_POST['curTime'];
	// if( !isset($_POST['email']) || !isset($_POST['passd'])) { $res_array['error'] = 'No email or password!'; }
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	$get_user_sql = "SELECT * FROM admin_user";
	$result_user = mysqli_query($conn, $get_user_sql);

	$error = false; $user_id = 0;
	if (mysqli_num_rows($result_user) > 0) {
		while($row_user = mysqli_fetch_assoc($result_user)) {
			if ($row_user['email'] === $email && $row_user['other'] === $token) {
				if ($curTime > $row_user['expire']) {$error = "Your login info expired, please re-login now";}
				else $user_id = $row_user['id']; 
			} 
		}
	}
	if ($user_id === 0)  $error = "There is not admin user.";
	else {
		$get_data_sql = "SELECT * FROM main_option";
		$result_data = mysqli_query($conn, $get_data_sql);
		if (mysqli_num_rows($result_data) > 0) {
			while($row_data = mysqli_fetch_assoc($result_data)) {
				array_push($res_array, (object)[ 'id' => $row_data["id"], 'part' => $row_data["part"], 'name' => $row_data["name"], 'label' => $row_data["label"], 'price' => $row_data["price"], 'piece'=>$row_data["piece"], 'description'=>$row_data["description"], 'img' => $row_data["img"], 'label_de' => $row_data["label_de"], 'description_de'=>$row_data["description_de"] ]);
			}
		} else $error = "Empty data.";
	}
	echo json_encode((object)['error'=>$error, 'data'=>(array)$res_array]);
	mysqli_close($conn);
?>