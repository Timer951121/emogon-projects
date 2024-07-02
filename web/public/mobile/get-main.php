<?php
	include '../other/connect_db.php';
	$_POST = json_decode(file_get_contents("php://input"), true);
	$res_array = []; $passd = $_POST['passd'];

	$get_sql = "SELECT * FROM customer WHERE passd='".$passd."'";
	$result = mysqli_query($conn, $get_sql);
	$main_info = $result->fetch_assoc();

	$login_result = false; $token = "Error QR code";
	if ($main_info) {
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
		$update_sql = "UPDATE customer SET other='".$token."' WHERE passd='".$passd."'";
		$update_result = mysqli_query($conn, $update_sql);


		$get_system = "SELECT * FROM system WHERE id=".$main_info['system_id'];
		$system_result = mysqli_query($conn, $get_system);
		$system_info = $system_result->fetch_assoc();
	
		$get_module = "SELECT * FROM module WHERE id=".$main_info['module_id'];
		$module_result = mysqli_query($conn, $get_module);
		$module_info = $module_result->fetch_assoc();
	}

	echo json_encode((object)['success'=>$login_result, 'token'=>$token, 'mainInfo'=>$main_info, 'systemInfo'=>$system_info, 'moduleInfo'=>$module_info]);
	mysqli_close($conn);
?>