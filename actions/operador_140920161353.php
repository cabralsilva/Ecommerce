<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8">
<?php
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("funcoes.php");
	
	//CADASTRA NEWSLETTER
	if (@$_GET["tabela"] == TB_New) {
		
		if (@$_GET["acao"] == "gravar") {
			
			if (validaEmail(@$_POST["newsletter"])) {
				$_database = new FM();
				$_news = $_database->busca(TB_New, array("EmailFormatado"=>"==" . str_replace("@", "/", @$_POST["newsletter"])));
				
				if ($_news) {
					echo "<script> alert('Já existe um usuário cadastrado com esse e-mail.'); </script>";
				} else {
					$_email = @$_POST["newsletter"];
				 	//$_SESSION["NEW"]["nome"] = @$_POST["nome"];
				 	$_nome = "";
					
					$_new = $_conexao->createRecord('NewsletterWeb');
					$_new->setField('Email', $_email);
					$_new->setField('Nome', $_nome);
					$_new->commit();
				
					echo "<script> alert('Cadastro realizado.'); </script>";
					echo "<script> parent.window.location.href='../index'; </script>";
				}
			
			} else
				echo "<script> alert('E-mail inválido.'); </script>";
				echo "<script> parent.window.location.href='../index'; </script>";
				die;
		}
	}
?>