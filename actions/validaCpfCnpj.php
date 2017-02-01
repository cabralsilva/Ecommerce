<?php
	include("funcoes.php");
	if ($_POST["tipo_pessoa"] == "juridica"){
		if (isCnpjValid(@$_POST["cpf_cnpj"]) != 1){
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		}
		return 1;
		
	}else if ($_POST["tipo_pessoa"] == "fisica"){
		if (validaCPF(@$_POST["cpf_cnpj"]) != 1){
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		}
		return 1;
		
	}
?>
