<?php
	// if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }
	header('Content-Type: application/json; charset=UTF-8');
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	$sql = "SELECT * FROM main_option";
	$result = mysqli_query($conn, $sql);

	$res_array = [];
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			array_push($res_array, (object)[ 'id' => $row["id"], 'part' => $row["part"], 'name' => $row["name"], 'key' => $row["name"], 'label' => $row["label"], 'price'=>$row["price"], 'img'=>$row["img"], 'piece'=>$row["piece"], 'description'=>$row["description"], 'label_de' => $row["label_de"], 'description_de'=>$row["description_de"] ]);
		}
	} else {
	}
	echo json_encode($res_array);
	mysqli_close($conn);
?>