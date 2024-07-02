<?php
	header("Access-Control-Allow-Origin: http://localhost:3000");
	header('Content-Type: application/json; charset=UTF-8');
	// $servername = "server621.iseencloud.com"; // "app.enerq.ch";
	// $username = "rungraco_emogon_admin"; // "powerboard_rohan";
	// $password = "rungraco_emogon_admin"; // "powerboard_rohan_123";
	// $dbname = "rungraco_emogon_admin"; // "enerqchser_powerboard";
	$servername = "app.enerq.ch";
	$username = "powerboard_rohan";
	$password = "powerboard_rohan_123";
	$dbname = "enerqchser_powerboard";
	$apiMobileKey = 'AAAAjQIr1MY:APA91bG0SbUTms1o27lIfQ3ii9z_Bz2uCPdAOFkqO2xVpGPiyNnAPtVu97RW7BW_wGXRfCLUUd0_on-AGQrGXhy8JIFixVlx0KqQIwxzG1-Ze7OrIjUAh5czW3ZoKdWee1-hhoJ6PsaK';
	// $apiWebKey = 'AAAAugBGUTY:APA91bECGmwEZrqsH_NPOMTQqRnxepa0O6Zp99dCgwwxvuVkhOhhBMpTOont2SwFrD-5jnX1bJ5fZxF2a1hEldmoH4zo0eaVMSocU_lduImAFZjHYvGONpOjgwE6ztF96cKctfYwrYkr';

	$conn = new mysqli($servername, $username, $password, $dbname);
	if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }
	if ($conn->set_charset("utf8")) {  }

	function getRndStr() {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$randomString = '';
		for ($i = 0; $i < 10; $i++) {
			$index = rand(0, strlen($characters) - 1);
			$randomString .= $characters[$index];
		}
		return $randomString;
	}
?>
