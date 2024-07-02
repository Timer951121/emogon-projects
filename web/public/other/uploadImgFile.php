<?php
	include 'connect_db.php';
	if(isset($_FILES['file']['name'])){
		$serverPath = dirname(__FILE__);
		$type = $_POST['type'];
		
		$filename = $_FILES['file']['name']; $new_name = (string)time(); // $_POST['fileName'];
		$location = $serverPath."/images//".$new_name.'.jpg'; // $filename;
		if ($type==='check') {
			$location = $serverPath."/check_images//".$new_name.'.jpg';
		} else if ($type==='message') {
			$format = $_POST['format'];
			$location = $serverPath."/message_images//".$new_name.'.'.$format;
		} else if ($type==='invoice') {
			$new_name = $_POST['fileName'];
			$location = $serverPath."/invoice_pdf//".$new_name.'.pdf';
		} else if ($type==='technical') {
			$new_name = $_POST['fileName']."_".$_POST['systemId'];
			$location = $serverPath."/technical_pdf//".$new_name.'.pdf';
		} else if ($type==='profile') {
			$format = $_POST['format'];
			$location = $serverPath."/profile_images//".$new_name.'.'.$format;
		}
	
		$file_name = '';
		if(move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
			$file_name = $new_name;
			if ($type==='invoice') {
				$customer_id = $_POST['customerId'];
				$system_id = $_POST['systemId'];
				$part = $_POST['part'];
				$name = $new_name;
				$time = time();
				$paid = false;
				$insert_invoice_sql = "INSERT INTO invoice (customer_id, system_id, part, name, time, paid) VALUES (".$customer_id.", ".$system_id.", '".$part."', '".$name."', ".$time.", false)";
				$insert_result = mysqli_query($conn, $insert_invoice_sql);
			} else if ($type==='technical') {
				$customer_id = $_POST['customerId'];
				$system_id = $_POST['systemId'];
				$part = $_POST['part'];
				$name = $new_name;
				$time = time();
				$status = '';
				$insert_technical_sql = "INSERT INTO technical (customer_id, system_id, part, name, time, real_name) VALUES (".$customer_id.", ".$system_id.", '".$part."', '".$_POST['fileName']."', ".$time.", '".$new_name."')";
				$insert_result = mysqli_query($conn, $insert_technical_sql);
			} else if ($type==='profile') {
				$customer_id = $_POST['customerId'];
				$format = $_POST['format'];
				$file_name = $new_name.'.'.$format;
				$update_sql = "UPDATE customer SET image='".$file_name."' WHERE id=".$customer_id;
				$update_result = mysqli_query($conn, $update_sql);
			}
		}
		$server_ip = $_SERVER['SERVER_ADDR'];
		// echo $file_name;
		echo json_encode((object)['file_name'=>$file_name]);
		exit;
	}
?>