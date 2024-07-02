<?php
	header("Access-Control-Allow-Origin: http://localhost:3000");
	function change_str_sign($str) {
		if (!$str) return '';
		$str = str_replace("'", "XX0", $str);
		$str = str_replace('"', "XX1", $str);
		$str = str_replace(",", "XX2", $str);
		return $str;
	}

	function change_sign_str($str) {
		if (!$str) return '';
		$str = str_replace("XX0", "'", $str);
		$str = str_replace("XX1", '"', $str);
		$str = str_replace("XX2", ",", $str);
		return $str;
	}

?>