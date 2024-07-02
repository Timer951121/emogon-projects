<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$statusArr = $_POST['statusArr'];
	$update_result = true;

	foreach ($statusArr as $item) {
		$update_sql = "UPDATE invoice SET paid=".$item['paid']." WHERE id=".$item['id'];
		$item_result = mysqli_query($conn, $update_sql);
		if (!$item_result) $update_result = false;
	}

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>
