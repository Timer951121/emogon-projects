<?php
	header('Content-Type: application/json; charset=UTF-8');
	$res_array = []; $id = $_POST['id']; $label = $_POST['label']; $label_de = $_POST['label_de'];
	// if( !isset($part) || !isset($name) || !isset($name) || !isset($name) || !isset($name)) { $res_array['error'] = 'No email or password!'; }
	$update_type = $_POST['updateType'];
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	$update_sql = "UPDATE main_label SET label='".$label."', label_de='".$label_de."' WHERE id=".$id;
	$update_result = mysqli_query($conn, $update_sql);

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>
