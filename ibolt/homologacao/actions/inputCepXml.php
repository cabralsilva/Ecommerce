<?php

	if (@$_GET["cep1"] != "" and @$_GET["cep2"] != "") {
		$cep = @$_GET["cep1"] . @$_GET["cep2"];
		$url = 'www.iboltsys.com.br/modulos/cep/index.php?par='.$cep;
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		echo $result = curl_exec($curl);
		
	} else {
		echo "erro";
	}
	
?>