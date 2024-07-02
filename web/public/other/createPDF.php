<?php
	header("Access-Control-Allow-Origin: http://localhost:3000");
	require('fpdf.php');

	// class PDF extends FPDF {
	// 	function Header() {
	// 		$this->Image('logo.png',10,6,30); // Logo
	// 		$this->SetFont('Arial','B',15); // Arial bold 15
	// 		$this->Cell(80); // Move to the right
	// 		$this->Cell(30,10,'Title',1,0,'C'); // Title
	// 		$this->Ln(20); // Line break
	// 	}

	// 	function Footer() {
	// 		$this->SetY(-15); // Position at 1.5 cm from bottom
	// 		$this->SetFont('Arial','I',8); // Arial italic 8
	// 		$this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C'); // Page number
	// 	}
	// }

	$local_test = false;
	if ($_SERVER['HTTP_HOST'] === 'localhost') $local_test = true;
	
	$border = 0;

	if ($local_test) {
		// echo('local');
		$company_str = 'Iseppi Frigoriferi SA';
		$company = '';
		if ($company_str) $company = $company_str;
		$user_name = 'Peter Müller';
		$street = 'Birkenstrasse 9';
		$city = 'Münchenstein';
		$canton = 'Schweiz';
		$zip_code = '12345678';
		$qr_code = '6KINIPUUL4QE';
		$system_number = '0011223344';
		$pdf_name = 'pdfName';
	} else {
		// echo('server');
		$company = '';
		if ($_POST['company']) $company = $_POST['company'];
		$user_name = $_POST['name'];
		$street = $_POST['street'];
		$city = $_POST['location'];
		$canton = $_POST['canton'];
		$zip_code = $_POST['zipCode'];
		$qr_code = $_POST['passd'];
		$system_number = $_POST['systemNumber'];
		$pdf_name = $_POST['pdfName'];
	}

	$address = $zip_code.' '.$city;

	$pdf = new FPDF('P','mm','A4'); // 'L', pt, cm, in
	$pdf->SetMargins(24.5, 17.5, 24.5);
	$pdf->AddPage();
	
	$pdf->Image('./images/app-logo.png', 130, 11, 55);
	$pdf->SetFont('Arial', '', 9.5);
	
	$pdf->Cell( 0, 12, '', $border, 1);

	$pdf->SetFont('Arial', '', 10.7); $line_small = 4.7;
	$pdf->Cell( 120, $line_small, utf8_decode(''), $border, 0);		$pdf->Cell( 0, $line_small, utf8_decode('Ihre Projekt-Nr:'), 	$border, 1);
	$pdf->Cell( 120, $line_small, utf8_decode(''),  $border, 0);	$pdf->Cell( 0, $line_small, $system_number, 	$border, 1);
	$pdf->Cell( 120, $line_small, 'Enerq GmbH | Eiweg 10 | 4460 Gelterkinden', $border, 0); $pdf->Cell( 0, $line_small, '', 	$border, 1);
	$pdf->Cell( 120, $line_small, utf8_decode($company), $border, 0); $pdf->Cell( 0, $line_small, 'Datum: '.date('d.m.y'), 	$border, 1);

	$line_y0 = 43.3;
	$pdf->Line(25, $line_y0, 100, $line_y0);

	$pdf->Cell( 0, $line_small, utf8_decode($user_name), $border, 1);
	$pdf->Cell( 0, $line_small, utf8_decode($street),  $border, 1);
	$pdf->Cell( 0, $line_small, utf8_decode($address), $border, 1);
	$pdf->Cell( 0, $line_small, utf8_decode('Schweiz'), $border, 1);


	$pdf->Cell( 0, 11.5, '', $border, 1);

	$pdf->SetFont('Arial', 'B', 12);
	$pdf->Cell( 0, 6, utf8_decode('Ihr persönlicher Zugang zur Enerq Kunden-App'), $border, 1);
	$line_y = 84.0;
	$pdf->Line(25, $line_y, 123, $line_y);

	$pdf->Cell( 0, 5.5, '', $border, 1);

	$des_height = 5.2; $font_size = 11;
	// $pdf->SetFont('Arial', '', $font_size);
	// $pdf->Cell( 0, 4, '', $border, 1);
	// $pdf->MultiCell( 0, $des_height, utf8_decode('Sehr geehrter Neukunde,'), $border, 1);
	// $pdf->Cell( 0, 3.5, '', $border, 1);

	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 60, $des_height, utf8_decode('Herzlichen Dank, dass Sie sich für '), $border, 0);
	$pdf->SetFont('Arial', 'B', $font_size); $pdf->Cell( 14.1, $des_height, utf8_decode('ENERQ'), $border, 0);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode(', Ihren Experten für Solarsysteme & nachhaltige'), $border, 1);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, 4.8, utf8_decode('Enerqielösungen, entschieden haben. Wir heißen Sie herzlich willkommen und freuen uns'), $border, 1);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, 4.5, utf8_decode('darauf, Ihnen unseren hochwertigen Service anzubieten.'), $border, 1);

	$pdf->Cell( 0, 4.4, '', $border, 1);

	$des_height = 4.7;

	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 74.8, $des_height, utf8_decode('Um Ihnen den einfachen Zugriff auf unsere'), $border, 0);
	$pdf->SetFont('Arial', 'B', $font_size); $pdf->Cell( 29, $des_height, utf8_decode('innovative App'), $border, 0);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('zu ermöglichen, haben wir ein'), $border, 1);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('benutzerdefiniertes Login-Verfahren implementiert. Sie erhalten von uns einen speziellen'), $border, 1);

	$pdf->SetFont('Arial', 'B', $font_size); $pdf->Cell( 17, $des_height, utf8_decode('QR-Code'), $border, 0);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode(', den Sie für den Login in der App verwenden können.'), $border, 1);
	
	$pdf->Cell( 0, 4.4, '', $border, 1);

	$pdf->MultiCell( 0, $des_height, utf8_decode('Bitte beachten Sie die nachfolgenden Schritte, um auf die App zuzugreifen:'), $border, 1);
	
	$pdf->Cell( 0, 4.4, '', $border, 1);

	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 64.7, $des_height, utf8_decode('1. Laden Sie die Enerq-App aus dem'), $border, 0);
	$pdf->SetFont('Arial', 'B', $font_size); $pdf->Cell( 19.7, $des_height, utf8_decode('App Store'), $border, 0);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('für iOS & iPadOS oder für Android aus dem'), $border, 1);
	$pdf->SetFont('Arial', 'B', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('Google Play Store'), $border, 1);

	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('2. Öffnen Sie die Enerq-App auf Ihrem Smartphone.'), $border, 1);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('3. Klicken Sie auf die Option "Zum Login".'), $border, 1);

	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 44, $des_height, utf8_decode('4. Wählen Sie die Option'), $border, 0);
	$pdf->SetFont('Arial', 'B', $font_size); $pdf->Cell( 38.5, $des_height, utf8_decode('"QR-Code scannen"'), $border, 0);
	$pdf->SetFont('Arial', '', $font_size); $pdf->Cell( 0, $des_height, utf8_decode('aus.'), $border, 1);

	$pdf->MultiCell( 0, $des_height, utf8_decode('5. Die Kamera Ihres Smartphones wird aktiviert. Richten Sie sie auf den persönlichen QR-Code auf diesem Dokument'), $border, 1);
	$pdf->MultiCell( 0, $des_height, utf8_decode('6. Die App erkennt automatisch den QR-Code und wird Sie dann eigenständig anmelden.'), $border, 1);

	$pdf->Cell( 0, 4.4, '', $border, 1);

	$pdf->MultiCell( 0, $des_height, utf8_decode('Sollten Sie Fragen oder Schwierigkeiten haben, steht Ihnen unser Kundendienstteam jederzeit gerne zur Verfügung. Sie erreichen uns telefonisch unter +41 41 515 88 88 oder per E-Mail unter support@enerq.ch'), $border, 1);

	$pdf->Cell( 0, 4.4, '', $border, 1);

	$pdf->MultiCell( 0, $des_height, utf8_decode('Vielen Dank für Ihr Vertrauen in ENERQ. Wir sind stolz darauf, Teil Ihrer nachhaltigen Energielösungen zu sein.'), $border, 1);

	$pdf->Cell( 0, 4.4, '', $border, 1);

	$pdf->MultiCell( 0, $des_height, utf8_decode('Mit energiegeladenen Grüßen,'), $border, 1); // sonnigen

    
	$pdf->Cell( 0, 6, '', $border, 1);
	$pdf->Cell( 0, $des_height, utf8_decode('Ihr ENERQ-Team'), $border, 1); // Marco Serrago
	$pdf->Cell( 131, $des_height, utf8_decode(''), $border, 0); $pdf->Cell( 0, $des_height, utf8_decode('Ihr persönlicher '),	$border, 1); // ENERQ GmbH

	
	$pdf->Cell( 136, $des_height, '',  $border, 0);	$pdf->Cell( 0, $des_height, utf8_decode('QR-Code:'),	$border, 1);
	$pdf->Cell( 0, 33, '', $border, 1);
	$pdf->Cell( 131, 8, '',  $border, 0);	$pdf->Cell( 0, 8, $qr_code, $border, 1);

	$pdf->Image('./qr_images/'.$qr_code.'.png', 156, 238.7, 29);

	if ($local_test) {
		$pdf->Output();
	} else {
		$pdf->Output('F', 'mail_pdf/'.$pdf_name.'.pdf');
	}
?>
