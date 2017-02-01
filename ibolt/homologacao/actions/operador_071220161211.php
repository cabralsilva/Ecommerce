<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8">
<?php
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("funcoes.php");
	require_once("../actions/funcoesWS.php");
	require_once("../class/PHPMailer-master/class.phpmailer.php");
	
	//CADASTRA NEWSLETTER
	if (@$_GET["tabela"] == TB_New) {
		
		if (@$_GET["acao"] == "gravar") {
			
			if (validaEmail(@$_POST["newsletter"])) {
				
				$_arrayEmail = array(
					'email' => @$_POST["newsletter"]
				);
				$return = sendWsLogin($_arrayEmail, UrlWs . "insereNewsletter");

				if ($return->codStatus != 1) {
					if($return != null){
						if ($return->codStatus == 2) {
							echo "<script> alert('Já existe um usuário cadastrado com esse e-mail.'); </script>";
							
						}elseif ($return->codStatus > 2) {
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
							echo "<script> alert('Ops, houve uma falha ao realizar o seu cadastro. Tente novamente!'); </script>";
						}	
					}
				}else {
					echo "<script> alert('Cadastro realizado.'); </script>";
					echo "<script> parent.window.location.href='../index'; </script>";
				}
			
			} else{
				echo "<script> alert('E-mail inválido.'); </script>";
				echo "<script> parent.window.location.href='".URL."index'; </script>";
				die;
			}
			echo "<script> parent.window.location.href='".URL."index'; </script>";
		}
	}
?>