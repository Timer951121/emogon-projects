<?php
	header('Content-Type: application/json; charset=UTF-8');
	$res_array = []; $id = $_POST['id']; $part = $_POST['part']; $name = $_POST['name']; $label = $_POST['label']; $price = $_POST['price']; $piece = $_POST['piece']; $description = $_POST['description']; $img = $_POST['img']; $label_de = $_POST['label_de']; $description_de = $_POST['description_de'];
	// if( !isset($part) || !isset($name) || !isset($name) || !isset($name) || !isset($name)) { $res_array['error'] = 'No email or password!'; }
	$update_type = $_POST['updateType'];
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM main_option WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE main_option SET part='".$part."', name='".$name."', label='".$label."', piece='".$piece."', description='".$description."', img='".$img."', label_de='".$label_de."', description_de='".$description_de."', price=".$price." WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO main_option (part, name, price, piece, description) VALUES ('".$part."', '".$name."', ".$price.", '".$piece."', '".$description."')";
		}
	}
	// echo ($update_sql);
	$update_result = mysqli_query($conn, $update_sql);

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>