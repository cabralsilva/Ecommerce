<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8">
<?php
	session_start();
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("../actions/funcoes.php");
	
	verificaSSL(true);
	
	if (@$_GET["acao"]=="alterar-senha") {
		if($_SESSION["CADASTRADO"]["id"]!=""){
			$_cliente = $_conexao->getRecordById('ClienteWeb', $_SESSION["CADASTRADO"]["id"]);
			
			$_cliente->setField("Senha", @$_POST["senha"]);
			$_cliente->commit();
		}
		
		die("<script> alert('Senha alterada com sucesso!'); parent.window.location.href='../carrinhoCadastro'; </script>");
	}		
?>