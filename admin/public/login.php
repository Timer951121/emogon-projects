<?php
	header('Content-Type: application/json; charset=UTF-8');
	$res_array = []; $email = $_POST['email']; $passd = $_POST['passd']; $expire = $_POST['expire']; $cur_time = $_POST['curTime']; $device_id = $_POST['deviceId'];
	// if( !isset($_POST['email']) || !isset($_POST['passd'])) { $res_array['error'] = 'No email or password!'; }
	$servername = "emogon.com";
	$username = "emogonconfig";
	$password = "%213eZg0j";
	$dbname = "emogoncomh_main";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	$get_sql = "SELECT id, name, email, password, other, expire, device_id FROM admin_user";
	$result = mysqli_query($conn, $get_sql);

	$login_result = false; $token = "Error email or password";
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			if ($row['email'] === $email && $row['password'] === $passd) {
				if ($cur_time < $row['expire'] && $row['device_id'] && $row['device_id'] !== $device_id) {
					$token = "Aleady loggined the account, please use other account!";
				} else {
					$login_result = true;
					function getName($n) {
						$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
						$randomString = '';
						for ($i = 0; $i < $n; $i++) {
							$index = rand(0, strlen($characters) - 1);
							$randomString .= $characters[$index];
						}
						return $randomString;
					}
					$token = getName(20);
					$update_sql = "UPDATE admin_user SET other='".$token."', device_id='".$device_id."', expire=".$expire." WHERE id=".$row["id"];
					$update_result = mysqli_query($conn, $update_sql);
				}
			}
		}
	} else {
	}
	echo json_encode((object)['success'=>$login_result, 'token'=>$token, 'update_result'=>$update_result]);
	mysqli_close($conn);
?>