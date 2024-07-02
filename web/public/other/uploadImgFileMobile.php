<?php
	header("Access-Control-Allow-Origin: http://localhost:3000");
	if(isset($_FILES['file']['name'])){
		$serverPath = dirname(__FILE__);
		
		$filename = $_FILES['file']['name']; $new_name = (string)time(); // $_POST['fileName'];
		$format = $_POST['format'];
		$location = $serverPath."/message_images//".$new_name.'.'.$format;
	
		$file_name = '';
		if(move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
			$file_name = $new_name;
		}
		$server_ip = $_SERVER['SERVER_ADDR'];
		// echo $file_name;
		echo json_encode((object)['file_name'=>$file_name, 'format'=>$format]);
		exit;
	}
?>