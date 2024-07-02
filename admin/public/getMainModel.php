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

	$error = false; $user_id = 0; $res_category = []; $res_premade = []; $res_label = []; $res_proto = []; $res_custom = [];
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
		$sql_category = "SELECT * FROM main_category";
		$result_category = mysqli_query($conn, $sql_category);
		if (mysqli_num_rows($result_category) > 0) {
			while($row = mysqli_fetch_assoc($result_category)) {
				array_push($res_category, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'label' => $row["label"], 'label_de' => $row["label_de"] ]); 
			}
		}
	
		$sql_label = "SELECT * FROM main_label";
		$result_label = mysqli_query($conn, $sql_label);
		if (mysqli_num_rows($result_label) > 0) {
			while($row = mysqli_fetch_assoc($result_label)) {
				array_push($res_label, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'label' => $row["label"], 'label_de' => $row["label_de"], 'img' => $row["img"] ]); 
			}
		}

		$sql_custom = "SELECT * FROM main_custom";
		$result_custom = mysqli_query($conn, $sql_custom);
		if (mysqli_num_rows($result_custom) > 0) {
			while($row = mysqli_fetch_assoc($result_custom)) {
				array_push($res_custom, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'label' => $row["label"], 'description' => $row["description"], 'price'=>$row["price"], 'img'=>$row["img"], 'label_de' => $row["label_de"], 'description_de' => $row["description_de"] ]);
			}
		}
	
		$sql_premade = "SELECT * FROM main_premade";
		$result_premade = mysqli_query($conn, $sql_premade);
		if (mysqli_num_rows($result_premade) > 0) {
			while($row = mysqli_fetch_assoc($result_premade)) {
				array_push($res_premade, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'label' => $row["label"], 'description' => $row["description"], 'price'=>$row["price"], 'img'=>$row["img"], 'label_de' => $row["label_de"], 'description_de' => $row["description_de"] ]);
			}
		}
	
		$sql_proto = "SELECT * FROM main_prototype";
		$result_proto = mysqli_query($conn, $sql_proto);
		if (mysqli_num_rows($result_proto) > 0) {
			while($row = mysqli_fetch_assoc($result_proto)) {
				array_push($res_proto, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'label' => $row["label"], 'description' => $row["description"], 'price'=>$row["price"], 'img'=>$row["img"], 'label_de' => $row["label_de"], 'description_de' => $row["description_de"] ]);
			}
		}
	
		echo json_encode((object)['category_data'=>(array)$res_category, 'label_data'=>(array)$res_label, 'custom_data'=>(array)$res_custom, 'premade_data'=>(array)$res_premade, 'proto_data'=>(array)$res_proto]);
	}
	mysqli_close($conn);
?>