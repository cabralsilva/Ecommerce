<?php
include 'loginPainelController.php';
date_default_timezone_set ( 'America/Sao_Paulo' );
if (isset($_POST["pessoa"])){
	if($_POST["pessoa"] == "fisica"){
		if (validaCPF($_POST["cpf"]) != 1){
			echo "<script> alert('Ops, CPF inválido!'); </script>";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
			die();
		}
		$_POST["cpf"] = str_replace(".", "", $_POST["cpf"]);
		$_POST["cpf"] = str_replace("-", "", $_POST["cpf"]);
	}elseif ($_POST["pessoa"] == "juridica"){
		if(isCnpjValid($_POST["cnpj"]) != 1){
			echo "<script> alert('Ops, CNPJ inválido!'); </script>";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpj'; </script>";
			die();
		
		}
		$_POST["cnpj"] = str_replace(".", "", $_POST["cnpj"]);
		$_POST["cnpj"] = str_replace("-", "", $_POST["cnpj"]);
		$_POST["cnpj"] = str_replace("/", "", $_POST["cnpj"]);
	}
	
	$_POST ["telefone"] = preg_replace ( "/[^0-9]/", "", $_POST ["telefone"] );
	
	if ($_POST ["telefone2"]) {
		$_POST ["telefone2"] = preg_replace ( "/[^0-9]/", "", $_POST ["telefone2"] );
	}
	
	
	
	if ($_GET["acao"] == "editar") {
		if ($_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO"){
			$_usuario = array (
				'codigoCliente' => $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"],
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
			);
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"] = $_POST["pessoa"] == "fisica" ? $_POST["nome-completo"] : $_POST["razao-social"];
			
			if ($_POST["pessoa"] == "fisica") {
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = $_POST["nome-completo"];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = $_POST["data-nascimento"];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = date ( "d/m/Y", strtotime ( $_POST["data-nascimento"] ) );
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = $_POST["cpf"];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = $_POST["rg"];
				$_usuario ['Nome'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"];
				$_usuario ['DataNascimento'] = date ( "Y-m-d", strtotime ( $_POST["data-nascimento"] ) );
				$_usuario ['Cpf'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"];
				$_usuario ['Rg'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"];
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = "";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = "";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = "";
			} else if ($_POST["pessoa"] == "juridica"){
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = "";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = "";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = "";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = "";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = "";
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = $_POST["razao-social"];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = $_POST["cnpj"];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = $_POST["ie"];
				$_usuario ['RazaoSocial'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"];
				$_usuario ['Cnpj'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"];
				$_usuario ['InscricaoEstadual'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"];
					
			}
			
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"] = $_POST["email"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"] = substr($_POST["telefone"], 0, 2);
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"] = substr($_POST["telefone"], 2);
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"] = substr($_POST["telefone2"], 0, 2);
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"] = substr($_POST["telefone2"], 2);
			
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"] = $_POST["cep1"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"] = $_POST["cep2"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"] = $_POST["cep1"] . $_POST["cep2"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"] = $_POST["cep1"] . "-" . $_POST["cep2"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"] = $_POST["endereco"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"] = $_POST["endereco-numero"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"] = $_POST["complemento"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"] = $_POST["bairro"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"] = $_POST["cidade"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"] = $_POST["estado"];
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"] = $_POST["pontos"];
			
			$_usuario ['Email'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"];
			$_usuario ['Ddd1'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"];
			$_usuario ['Telefone1'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"];
			$_usuario ['Ddd2'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"];
			$_usuario ['Telefone2'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"];
			
			$_usuario ['Cep'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"];
			$_usuario ['Logradouro'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"];
			$_usuario ['Numero'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"];
			$_usuario ['Complemento'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"];
			$_usuario ['Bairro'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"];
			$_usuario ['Municipio'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"];
			$_usuario ['Uf'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"];
			$_usuario ['InformacoesReferencia'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"];
			
			$json_usuario = json_encode ( $_usuario );
			
			$resposta = sendWsJson ( $json_usuario, UrlWs . "atualizarCliente" );
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
					echo "<script> alert('Ops, houve um erro na comunicação com o banco de dados. Tente novamente!'); </script>";
					if ($_POST["pessoa"] == "fisica")
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
					else if ($_POST["pessoa"] == "juridica")
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpj'; </script>";
					else
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
	
					die ();
				}else{
					echo "<script> alert('Conta atualizada com sucesso!');</script>";
					if ($_POST["pessoa"] == "fisica")
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
					else if ($_POST["pessoa"] == "juridica")
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpj'; </script>";
					else
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
	
					die ();
				}
			}else {
				
				if ($_POST["pessoa"] == "fisica")
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
				else if ($_POST["pessoa"] == "juridica")
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpj'; </script>";
				else
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
						
				die ();
			}
		}elseif($_SESSION["PEDIDO"]["USUARIO"] == "NOVO"){
			$_usuario = array (
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
			);
			
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"] = $_POST["pessoa"] == "fisica" ? $_POST["nome-completo"] : $_POST["razao-social"];
				
			if ($_POST["pessoa"] == "fisica") {
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = $_POST["nome-completo"];
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = $_POST["data-nascimento"];
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = date ( "d/m/Y", strtotime ( $_POST["data-nascimento"] ) );
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = $_POST["cpf"];
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = $_POST["rg"];
				$_usuario ['Nome'] = $_POST["nome-completo"];
				$_usuario ['DataNascimento'] = date ( "Y-m-d", strtotime ( $_POST["data-nascimento"] ) );
				$_usuario ['Cpf'] = $_POST["cpf"];
				$_usuario ['Rg'] = $_POST["rg"];
					
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = "";
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = "";
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = "";
			} else if ($_POST["pessoa"] == "juridica"){
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = "";
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = "";
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = "";
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = "";
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = "";
					
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = $_POST["razao-social"];
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = $_POST["cnpj"];
// 				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = $_POST["ie"];
				$_usuario ['RazaoSocial'] = $_POST["razao-social"];
				$_usuario ['Cnpj'] = $_POST["cnpj"];
				$_usuario ['InscricaoEstadual'] = $_POST["ie"];
					
			}
				
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"] = $_POST["email"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"] = substr($_POST["telefone"], 0, 2);
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"] = substr($_POST["telefone"], 2);
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"] = substr($_POST["telefone2"], 0, 2);
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"] = substr($_POST["telefone2"], 2);
				
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"] = $_POST["cep1"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"] = $_POST["cep2"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"] = $_POST["cep1"] . $_POST["cep2"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"] = $_POST["cep1"] . "-" . $_POST["cep2"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"] = $_POST["endereco"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"] = $_POST["endereco-numero"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"] = $_POST["complemento"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"] = $_POST["bairro"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"] = $_POST["cidade"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"] = $_POST["estado"];
// 			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"] = $_POST["pontos"];
											
			$_usuario ['Email'] = $_POST["email"];
			$_usuario ['Ddd1'] = substr($_POST["telefone"], 0, 2);
			$_usuario ['Telefone1'] = substr($_POST["telefone"], 2);
			$_usuario ['Ddd2'] = substr($_POST["telefone2"], 0, 2);
			$_usuario ['Telefone2'] = substr($_POST["telefone2"], 2);
				
			$_usuario ['Cep'] = $_POST["cep1"] . $_POST["cep2"];
			$_usuario ['Logradouro'] = $_POST["endereco"];
			$_usuario ['Numero'] = $_POST["endereco-numero"];
			$_usuario ['Complemento'] = $_POST["complemento"];
			$_usuario ['Bairro'] = $_POST["bairro"];
			$_usuario ['Municipio'] = $_POST["cidade"];
			$_usuario ['Uf'] = $_POST["estado"];
			$_usuario ['InformacoesReferencia'] = $_POST["pontos"];
			$_usuario ['senhaCliente'] = $_POST ["senha"];
			
			$json_usuario = json_encode ( $_usuario );
				
			$resposta = sendWsJson ( $json_usuario, UrlWs . "cadastrarCliente" );
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
					echo "<script> alert('Ops, houve um erro na comunicação com o banco de dados. Tente novamente!'); </script>";
					if ($_POST["pessoa"] == "fisica")
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/views/cadastroPainel.php'; </script>";
					else if ($_POST["pessoa"] == "juridica")
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/views/cadastropjPainel.php'; </script>";
					else
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/views/loginPainel.php'; </script>";
	
					die ();
				}else{
					$_SESSION ["PEDIDO"]["USUARIO"] = "CADASTRADO";
					echo "<script> alert('Cadastro efetuado com sucesso!');</script>";
					$lp = new loginPainel();
					$lp->logar($_POST["email"], $_POST ["senha"]);
					
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
	
					die ();
				}
			}else {
			
				if ($_POST["pessoa"] == "fisica")
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
				else if ($_POST["pessoa"] == "juridica")
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpj'; </script>";
				else
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
	
				die ();
			}
		}
	}else{
		if ($_POST["pessoa"] == "fisica")
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
		else if ($_POST["pessoa"] == "juridica") 
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpj'; </script>";
		else 
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
		die();
	}
		
	
	
}else{
	echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
}