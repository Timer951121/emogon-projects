<?php
	include '../other/connect_db.php';
	include '../other/changeString.php';

	$update_type = $_POST['updateType'];
	$id = $_POST['id'];
	$title = $_POST['title'];
	$description = $_POST['description'];
	$image = $_POST['image'];
	$time = time();

	$title = change_str_sign($title);
	$description = change_str_sign($description);

	$update_error = "";
	if ($update_type === 'delete') {
		$update_sql = "DELETE FROM news WHERE id=".$id;
	} else {
		if ($id) {
			$update_sql = "UPDATE news SET title='".$title."', description='".$description."', image='".$image."' WHERE id=".$id;
		} else {
			$update_sql = "INSERT INTO news (title, description, image, time) VALUES ('".$title."', '".$description."', '".$image."', ".$time.")";
		}
	}
	$update_result = false;
	if ($update_sql) {
		$update_result = mysqli_query($conn, $update_sql);
		$max_id_result = mysqli_query($conn, "SELECT MAX(id) FROM news");
		$row = mysqli_fetch_row($max_id_result);
		$max_id = $row[0];
	} else if ($update_error) {
		// $update_result = $update_error;
	}

	echo json_encode((object)['success'=>$update_result, 'error'=>$update_error, 'maxId'=>$max_id]);
	mysqli_close($conn);
?>
