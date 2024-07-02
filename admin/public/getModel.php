<?php
	// header("Content-Type: text/html; charset=ISO-8859-1",true);
	// if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }
	header('Content-Type: application/json; charset=UTF-8');
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	$sql_category = "SELECT * FROM main_category";
	$result_category = mysqli_query($conn, $sql_category);
	$res_category = [];
	if (mysqli_num_rows($result_category) > 0) {
		while($row = mysqli_fetch_assoc($result_category)) {
			array_push($res_category, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'key' => $row["name"], 'label' => $row["label"], 'label_de' => $row["label_de"] ]); 
		}
	}

	$sql_label = "SELECT * FROM main_label";
	$result_label = mysqli_query($conn, $sql_label);
	$res_label = [];
	if (mysqli_num_rows($result_label) > 0) {
		while($row = mysqli_fetch_assoc($result_label)) {
			array_push($res_label, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'key' => $row["name"], 'label' => $row["label"], 'label_de' => $row["label_de"] ]); 
		}
	}

	$sql_select = "SELECT * FROM main_premade";
	$result_select = mysqli_query($conn, $sql_select);
	$res_select = [];
	if (mysqli_num_rows($result_select) > 0) {
		while($row = mysqli_fetch_assoc($result_select)) {
			array_push($res_select, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'key' => $row["name"], 'label' => $row["label"], 'description' => $row["description"], 'price'=>$row["price"], 'img'=>$row["img"], 'label_de' => $row["label_de"], 'description_de' => $row["description_de"] ]);
		}
	}

	$sql_custom = "SELECT * FROM main_custom";
	$result_custom = mysqli_query($conn, $sql_custom);
	$res_custom = [];
	if (mysqli_num_rows($result_custom) > 0) {
		while($row = mysqli_fetch_assoc($result_custom)) {
			array_push($res_custom, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'key' => $row["name"], 'label' => $row["label"], 'description' => $row["description"], 'price'=>$row["price"], 'img'=>$row["img"], 'label_de' => $row["label_de"], 'description_de' => $row["description_de"] ]);
		}
	}

	$sql_proto = "SELECT * FROM main_prototype";
	$result_proto = mysqli_query($conn, $sql_proto);
	$res_proto = [];
	if (mysqli_num_rows($result_proto) > 0) {
		while($row = mysqli_fetch_assoc($result_proto)) {
			array_push($res_proto, (object)[ 'id' => $row["id"], 'name' => $row["name"], 'key' => $row["name"], 'label' => $row["label"], 'description' => $row["description"], 'price'=>$row["price"], 'img'=>$row["img"], 'label_de' => $row["label_de"], 'description_de' => $row["description_de"] ]);
		}
	}

	echo json_encode((object)['category_data'=>(array)$res_category, 'select_data'=>(array)$res_select, 'custom_data'=>(array)$res_custom, 'label_data'=>(array)$res_label, 'proto_data'=>(array)$res_proto]);
	mysqli_close($conn);

?>