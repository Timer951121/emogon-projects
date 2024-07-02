<?php
	include 'connect_db.php';
	$token = $_POST['token']; $device_id = $_POST['deviceId'];
	$cur_time = time();

	// if( !isset($_POST['email']) || !isset($_POST['passd'])) { $res_array['error'] = 'No email or password!'; }

	$get_sql = "SELECT * FROM login_session WHERE token='".$token."'";
	$result = mysqli_query($conn, $get_sql);

	$get_emp_sql = "SELECT * FROM employee";
	$emp_result = mysqli_query($conn, $get_emp_sql);

	$session_result = false; $emp_info = false;
	if (mysqli_num_rows($result) > 0) {
		while($session_row = mysqli_fetch_assoc($result)) {
			if ($session_row['device_id'] === $device_id && $cur_time < $session_row['expire_time']) {

				if (mysqli_num_rows($emp_result) > 0) {
					while($emp_row = mysqli_fetch_assoc($emp_result)) {
						if ($emp_row['id']===$session_row['emp_id']) {
							$session_result = true;
							$emp_info = $emp_row;
							$emp_info['passd'] = false;
							$emp_info['token'] = false;
						}
					}
				}
			}
		}
	} else {
	}
	echo json_encode((object)['success'=>$session_result, 'empInfo'=>$emp_info, 'curTime'=>$cur_time]);
	mysqli_close($conn);
?>