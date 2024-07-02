<?php
	include '../other/connect_db.php';

	$id = $_POST['id'];

	$update_sql = "UPDATE ticket SET status='close' WHERE id=".$id;
	$update_result = mysqli_query($conn, $update_sql);

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>
