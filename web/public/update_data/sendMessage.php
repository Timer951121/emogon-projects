<?php

	require '../vendor/autoload.php';

	include '../other/connect_db.php';
	include '../other/changeString.php';

	$system_id = $_POST['systemId'];
	$ticket_id = $_POST['ticketId'];
	$sender = $_POST['sender'];
	$content = $_POST['content'];
	$time = $_POST['time'];
	$other = $_POST['messageType'];
	$login_type = $_POST['loginType'];
	$customer = $login_type==='customer'?1:0;

	$content = change_str_sign($content);

	$insert_sql = "INSERT INTO message (time, system_id, ticket_id, sender, customer, content, other) VALUES (".$time.", ".$system_id.", ".$ticket_id.", ".$sender.", ".$customer.", '".$content."', '".$other."')";

	$insert_result = mysqli_query($conn, $insert_sql);

	$status_sql = "UPDATE ticket SET status='employee', last_time=".$time." WHERE id=".$ticket_id;
	$status_result = mysqli_query($conn, $status_sql);

	echo json_encode((object)['success'=>$insert_result]);

	// $customer_query = mysqli_query($conn, "SELECT other FROM customer WHERE id=".$customer_id);
	// $customer_res = mysqli_fetch_row($customer_query);
	// $token = $customer_res[0];

	// if ($token) {
	// 	// Instantiate the client with the project api_token and sender_id.
	// 	// $apiToken = 'AIzaSyCmPW89jfie-6IaASMDQmi3Hp9OhAb0Ats';
	// 	$deviceId = $token;
	// 	$senderId = '605626815686';
	// 	$client = new \Fcm\FcmClient($apiMobileKey, $senderId);

	// 	// Instantiate the push notification request object.
	// 	$notification = new \Fcm\Push\Notification();

	// 	// Enhance the notification object with our custom options.
	// 	$notification
	// 		->addRecipient($deviceId)
	// 		->setTitle($ticket_title)
	// 		->setBody('Arrived New Message')
	// 		->addData('type', 'message');

	// 	// Send the notification to the Firebase servers for further handling.
	// 	$client->send($notification);
	// 	// print_r($token);
	// }
	mysqli_close($conn);
?>
