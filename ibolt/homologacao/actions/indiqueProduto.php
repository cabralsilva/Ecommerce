<?php
	session_start();
	
	include("../class/constantes.php");
	include("../class/filemaker.class.php");
	include("../actions/funcoes.php");
	
	include("../class/PHPMailer-master/class.phpmailer.php");
	
	//if ($_POST["code"] == $_SESSION["security_code"]){ //captcha
	if (($_POST["code"] == $_SESSION["security_code"]) and (isset($_SESSION["security_code"])) and ($_SESSION["security_code"] != "")){ //captcha
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
			$_html .= "<a href='" . URL . "produto/" . geraDescricaoAmigavel($_produto["Descricao"]) . "/" . $_produto["CodigoProdutoGrade"] . "' title='Clique aqui para ser direcionado para nosso site'>" . $_produto["Descricao"] . "</a>";
			
			$sendEmail = sendEmail($_POST["email-amigo"], "Indicação de produto", $_html);
			if ($sendEmail != 1){
				$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
				$_conteudo .= "<strong>Descrição: </strong>" . $sendEmail . "<br><br>";
				$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
				$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
				$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
				$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
				$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
				$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
				$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
				sendEmailLog($_conteudo);
				echo "<script> alert('Ops, houve um erro no envio do email.'); </script>";
			}else
				echo "<script> alert('E-mail enviado com sucesso!'); </script>";

			die("<script> parent.window.location.reload(); </script>");

		}
	}
	echo "erro";
?>