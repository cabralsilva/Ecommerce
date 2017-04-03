<?php
include '../util/constantes.php';
include '../util/funcoesWS.php';
include '../util/funcoes.php';
include '../util/PHPMailer-master/class.phpmailer.php';
date_default_timezone_set ( 'America/Sao_Paulo' );
if ((isset($_POST["senha-atual"]) && isset($_POST["senha-nova"]) && isset($_POST["confirmacao"])) && ($_POST["senha-nova"] == $_POST["confirmacao"])){
	$_usuario = array (
			'codigoCliente' => $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"],
			'usr' => 'pdroqtl',
			'pwd' => 'jck9com*',
			'senhaCliente' => $_POST["senha-atual"]
	);
	$json_usuario = json_encode ( $_usuario );
	
	$resposta = sendWsJson ( $json_usuario, UrlWs . "verificarSenhaCliente" );
// 	print_r($resposta);
// 	die();
	if ($resposta != null) {
		if ($resposta->codStatus == 2) {
			echo "<script> alert('" . $resposta->msg . "'); </script>";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/alterarsenha'; </script>";
			die();
		}else if ($resposta->codStatus > 2) {
			$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
			$_conteudo .= "<strong>Descrição: </strong>" . $resposta->msg . "<br><br>";
			$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
			$_conteudo .= "<strong>Página Anterior: </strong>" . $_SERVER ['HTTP_REFERER'] . "<br><br>";
			$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
			$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
			$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
			$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
			$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
			sendEmailLog ( $_conteudo );
			echo "<script> alert('Ops, houve um erro na comunicação com o banco de dados. Tente novamente!'); </script>";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/alterarsenha'; </script>";
			die ();
		}else{
			$_usuario = array (
					'codigoCliente' => $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"],
					'usr' => 'pdroqtl',
					'pwd' => 'jck9com*',
					'senhaCliente' => $_POST["senha-nova"]
			);
			$json_usuario = json_encode ( $_usuario );
			$resposta = sendWsJson ( $json_usuario, UrlWs . "atualizarSenhaCliente" );
			if ($resposta != null) {
				if ($resposta->codStatus != 1) {
					$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $resposta->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . $_SERVER ['HTTP_REFERER'] . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
					sendEmailLog ( $_conteudo );
					echo "<script> alert('Ops, houve um erro na comunicação com o banco de dados. Sua senha NÃO foi alterada, tente novamente!'); </script>";
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/alterarsenha'; </script>";
					die ();
				}else {
					echo "<script> alert('Senha alterada com sucesso'); </script>";
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/alterarsenha'; </script>";
					die ();
				}
			}else {
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/alterarsenha'; </script>";
				die ();
			}
		}
	}else {
		echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/alterarsenha'; </script>";
		die ();
	}			
}else {
	print_r($_POST);
// 	echo "<script> alert('Fail'); </script>";
// 	echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
	die ();
}	