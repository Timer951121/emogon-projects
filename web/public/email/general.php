<?php
	header("Access-Control-Allow-Origin: http://localhost:3000");

	$email = $_POST['email'];
	$title = $_POST['title'];
	$content = $_POST['content'];
	$from = $_POST['from'];

	if ($from===false) {
		$from = 'enerqchser@enerq.ch';
	}

	$body = '<html><body>';
	$body .= $content;
	$body .= "</body></html>";

	$headers = "From: $from \r\n";
	$headers .= "Reply-To: $$from \r\n";
	$headers = 'MIME-Version: 1.0' . "\r\n" .
		'Content-type: text/html; charset=iso-8859-1' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();

	$result = false;
	if (mail($email, $title, $body, $headers)) {
		// guest.syon@gmail.com rohan.raj@trentecsystems.com bule_house@yahoo.com
		// , '-fwebmaster@example.com'
		$result = 'send';
	}
	else {};
	echo json_encode((object)['success'=>$result]);
?>