<?php
	header("Access-Control-Allow-Origin: http://localhost:3000");
	if(isset($_FILES['file']['name'])){
		$serverPath = dirname(__FILE__);
		
		// $filename = $_FILES['file']['name'];
		$filename = $_POST['QRCode'];
		$location = $serverPath."/qr_images//".$filename.'.png'; // $filename;
	
		$result = false;
		if(move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
			$result = true;
		}
		// $server_ip = $_SERVER['SERVER_ADDR'];
		// echo $file_name;
		echo json_encode((object)['result'=>$result]);
		exit;
	}
?>