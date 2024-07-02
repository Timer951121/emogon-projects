<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$invoice_id = $_POST['invoiceId'];
	$value = $_POST['value'];

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM invoice WHERE id=".$invoice_id;
	} else {
		$update_sql = "UPDATE invoice SET paid=".$value." WHERE id=".$invoice_id;
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
	}

	echo json_encode((object)['success'=>$update_result]);
	mysqli_close($conn);
?>
