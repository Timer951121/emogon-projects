<?php
	// Load composer
	require '../vendor/autoload.php';

	include '../other/connect_db.php';
	$id = $_POST['id'];
	$title = $_POST['title'];
	$message = $_POST['message'];
	// $type = $_POST['type'];

	$system_query = mysqli_query($conn, "SELECT customer_id FROM system WHERE id=".$id);
	$system_res = mysqli_fetch_row($system_query);

	$customer_query = mysqli_query($conn, "SELECT other FROM customer WHERE id=".$system_res[0]);
	$customer_res = mysqli_fetch_row($customer_query);
	$token = $customer_res[0];

	if ($token) {
		// Instantiate the client with the project api_token and sender_id.
		// $apiToken = 'AIzaSyCmPW89jfie-6IaASMDQmi3Hp9OhAb0Ats';
		$deviceId = $token;
		$senderId = '605626815686';
		$client = new \Fcm\FcmClient($apiMobileKey, $senderId);

		// Instantiate the push notification request object.
		$notification = new \Fcm\Push\Notification();

		// Enhance the notification object with our custom options.
		$notification
			->addRecipient($deviceId)
			->setTitle($title)
			->setBody($message);
			// ->addData('type', $type);

		$client->send($notification);
	} else {
		// print_r('no token');
	}
	echo json_encode((object)['apiKey'=>$apiMobileKey, 'token'=>$token]);
	mysqli_close($conn);

?>
