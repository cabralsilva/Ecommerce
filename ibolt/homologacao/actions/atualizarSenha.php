<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8">
<?php
	session_start();
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("../actions/funcoes.php");
	require_once("../actions/funcoesWS.php");
	require_once("../class/PHPMailer-master/class.phpmailer.php");
	verificaSSL(true);
	
	if (@$_GET["acao"]=="alterar-senha") {
		if($_SESSION["CADASTRADO"]["codigo"]!=""){
			$arrayCliente = array(
				'codigoCliente' => $_SESSION["CADASTRADO"]["codigo"],
			    'senhaCliente' => @$_POST["senha"],
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
    		);

    		$objJson = json_encode($arrayCliente);    		
    		$return = sendWsJson($objJson, UrlWs . "atualizarSenhaCliente");
			if ($return->codStatus != 1) {
				if($return != null){
					$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . $_SERVER['HTTP_REFERER'] . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
					sendEmailLog($_conteudo);
					echo "<script> alert('Ops, Falha ao atualizar a Senha. Tente novamente'); </script>";
					
				}
				echo "<script> parent.window.location.href='../carrinhoSenha'; </script>";
				die();
				
			}
		}
		die("<script> alert('Senha alterada com sucesso!'); parent.window.location.href='../carrinhoCadastro'; </script>");
	}		
?>