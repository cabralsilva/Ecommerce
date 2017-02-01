<?php
	@session_start();
		
	require_once("../class/constantes.php");
	require_once("funcoes.php");
	
	verificaSSL(true);
	
	
	$_SESSION["ENTREGA"]["nome"] = @$_POST["nome"];
	
	$_SESSION["ENTREGA"]["cep1"] = @$_POST["cep1"];
	$_SESSION["ENTREGA"]["cep2"] = @$_POST["cep2"];
	$_SESSION["ENTREGA"]["cep_completo"] = @$_POST["cep1"] . @$_POST["cep2"];
	$_SESSION["ENTREGA"]["cep_completo_formatado"] = @$_POST["cep1"] . "-" . @$_POST["cep2"];
	
	$_SESSION["ENTREGA"]["endereco"] = @$_POST["endereco"];
	$_SESSION["ENTREGA"]["numero"] = @$_POST["endereco-numero"];
	$_SESSION["ENTREGA"]["complemento"] = @$_POST["complemento"];
	$_SESSION["ENTREGA"]["bairro"] = @$_POST["bairro"];
	$_SESSION["ENTREGA"]["uf"] = @$_POST["uf"];
	$_SESSION["ENTREGA"]["cidade"] = @$_POST["cidade"];
	$_SESSION["ENTREGA"]["informacoes_referencia"] = @$_POST["pontos"];
	
	echo "<script> alert('Endereco atualizado com sucesso!'); window.location.href='../carrinhoPagamento'; </script>";			  
?>