<?php
	header('Content-Type: application/json; charset=UTF-8');
	$res_array = []; $id = $_POST['id']; $label = $_POST['label']; $price = $_POST['price']; $description = $_POST['description']; $img = $_POST['img']; $description_de = $_POST['description_de']; $label_de = $_POST['label_de']; $description_de = $_POST['description_de'];
	// if( !isset($part) || !isset($name) || !isset($name) || !isset($name) || !isset($name)) { $res_array['error'] = 'No email or password!'; }
	$update_type = $_POST['updateType'];
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	$update_sql = "UPDATE main_custom SET label='".$label."', description='".$description."', img='".$img."', label_de='".$label_de."', description_de='".$description_de."', label_de='".$label_de."', description_de='".$description_de."', price=".$price." WHERE id=".$id;
	$update_result = mysqli_query($conn, $update_sql);

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>
