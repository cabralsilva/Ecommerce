<?php
	session_start();
	
	include("../class/constantes.php");
	include("../class/filemaker.class.php");
	include("../actions/funcoes.php");
	
	include("../class/PHPMailer-master/class.phpmailer.php");
	
	if (@$_GET["cod_prod_grade"]!=""){
		$_sqlProdutoGrade = "SELECT PG.Codigo, PG.Id AS Id_ProdutoGrade, 
								PG.CodigoProdutoGrade,  
								PG.Descricao 
								FROM Produto AS P 
								INNER JOIN ProdutoGrade AS PG ON P.Codigo = PG.CodigoProduto 
								WHERE P.Liberado = 'Liberado' and PG.CodigoProdutoGrade = '" . @$_GET["cod_prod_grade"] . "' ORDER BY PG.DescricaoGradeWeb ASC";
		$_queryProdutoGrade = mysql_query($_sqlProdutoGrade);
		
		$_produto = array();
		while($_resultProdutoGrade = mysql_fetch_array($_queryProdutoGrade)) {
			$_produto = array(
								"Descricao"=>maiusculaFM($_resultProdutoGrade['Descricao']),
								"CodigoProdutoGrade"=>$_resultProdutoGrade['CodigoProdutoGrade'],
								"CodigoProduto"=>$_resultProdutoGrade['CodigoProdutoGrade'],
							);
		}
		
		$_html = "Ol&aacute; <strong>" . strtoupper($_POST["nome-amigo"]) . "</strong>,";
		$_html .= "<br><br> Seu amigo <strong>" . strtoupper($_POST["seu-nome"]) . "</strong> indicou um produto em nosso site que talvez seja do seu interesse!";
		$_html .= "<br><br> Mensagem: " . $_POST["mensagem-indicacao"];
		$_html .= "<br> Enviada por: " . $_POST["seu-nome"] . " (" . $_POST["seu-email"] . ")";
		$_html .= "<br><br> Clique no link abaixo e confira os detalhes do produto";
		
		$_html .= "<br><br>";
		$_html .= "<a href='" . URL . "/produto/" . geraDescricaoAmigavel($_produto["Descricao"]) . "/" . $_produto["CodigoProdutoGrade"] . "' title='Clique aqui para ser direcionado para nosso site'>" . $_produto["Descricao"] . "</a>";
		
		$mail = new PHPMailer(); // Cria a inst�ncia
		$mail->SetLanguage("br"); // Define o Idioma
		$mail->CharSet = "utf-8"; // Define a Codifica��o
		$mail->IsSMTP(); // Define que ser� enviado por SMTP
		$mail->Host = "smtp.plander.com.br"; // Servidor SMTP
		$mail->SMTPAuth = true; // Caso o servidor SMTP precise de autentica��o
		$mail->Port = "587";
		$mail->Username = "plander@plander.com.br"; // Usu�rio ou E-mail para autentica��o no SMTP
		$mail->Password = "ZION16equip!"; // Senha do E-mail
		//$mail->Username = "plander@plander.com"; // Usu�rio ou E-mail para autentica��o no SMTP
		//$mail->Password = "yanagisawa2014"; // Senha do E-mail
		$mail->IsHTML(true); // Enviar como HTML
		$mail->From = "plander@plander.com.br"; // Define o Remetente
		$mail->FromName = "PLANDER"; // Nome do Remetente
		
		//if (DEVELOP)
		//	$mail->AddAddress("josias_ju_af@hotmail.com", "Jozias"); // Email e Nome do destinat�rio
		//else
			$mail->AddAddress($_POST["email-amigo"], $_POST["nome-amigo"]); // Email e Nome do destinat�rio
		
		// Estes campos a seguir s�o opcionais, caso n�o queira usar, remova-os
		//$mail->AddReplyTo("email@dominio.com.br","Information"); // E-mail de Resposta
		//$mail->AddCC("plander@plander.com.br","Plander"); // Envia C�pia
		//$mail->AddBCC("suporte@iboltsys.com","Plander"); // Envia C�pia Oculta
		
		// Se voc� quiser anexar aquivos, pode utilizar os comandos abaixo, caso n�o v� enviar anexos, remova os comandos
		// $mail->AddAttachment("pdf/".$_arquivoNome); // Arquivo Anexo 1
		//$mail->AddAttachment("/tmp/image.jpg","new.jpg"); // Arquivo Anexo 2
		
		// Configura��o de Assuntos e Corpo do E-mail
		$mail->Subject = "Plander.com - Indicação de produto!"; // Define o Assunto
		$mail->Body = $_html; // Corpo da mensagem em formato HTML
		// Este campo abaixo � Opcional
		//$mail->AltBody = "Corpo da Mensagem somente Texto, sem formata��es"; // Voc� pode mandar um e-mail somente texto, caso o leitor de e-mails da pessoa n�o leia no formato HTML
		
		if($mail->Send()==false)
			echo "<script> alert('Houve um erro no envio do email.'); </script>";
		else
			echo "<script> alert('E-mail enviado com sucesso!'); </script>";
			
		die("<script> parent.window.location.reload(); </script>");
	}
?>