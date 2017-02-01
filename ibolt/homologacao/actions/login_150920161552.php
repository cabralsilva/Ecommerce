<?php
	@session_start();
	echo "<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\">";
		
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("funcoes.php");
	require_once("../class/PHPMailer-master/class.phpmailer.php");
	
	require_once("../actions/funcoesWS.php");
	verificaSSL(true);
	
	//LOGIN E CRIA PEDIDO
	if ($_GET["acao"]=="login") {
		error_reporting(0);
		ini_set("display_errors", 0);
		
		if (count($_SESSION["CART"])==0) {
			echo "<script> alert('Carrinho vazio.'); </script>";
			echo "<script> parent.window.location.href='../produtos'; </script>";
		}
		
		if (@$_POST["email-login"] != "" and @$_POST["senha-login"] != "") {

		 	$_chaves = array_keys($_SESSION["CART"]);
		 	$items = array();
			for ($_i=0; $_i<count($_chaves); $_i++){
				$item = array(
				  'codigo_produto_grade' => $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"],
				  'quantidade' => $_SESSION["CART"][$_chaves[$_i]]["quantidade"],
				  'valor' => $_SESSION["CART"][$_chaves[$_i]]["valor"],
				  'descricao' => $_SESSION["CART"][$_chaves[$_i]]["descricao"]
				);
				array_push($items, $item);
			}

			$arrayCliente = array(
				'Email' => @$_POST["email-login"],
	    		'senhaCliente' => @$_POST["senha-login"]
    		);
    		$arrayPedido = array(
				'Loja' => 'Virtual',
			    'Processo' => 'Carrinho abandonado',
			    'Editar' => '0',
			    'fkCliente' => $arrayCliente,
			    'lstItems' => $items
    		);

    		$objJson = json_encode($arrayPedido);    		
    		$return = sendWsJson($objJson, UrlWs . "novologin");
			if ($return->codStatus != 1) {
				switch ($return->codStatus) {
					case 2:
						echo "<script> alert('Falha no Login: $return->msg.'); </script>";
						break;
					default:
						echo "<script> alert('Erro interno ($return->codStatus). Você será direcionado ao login novamente!'); </script>";
						break;
				}
				echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
				die();
			} else {
				
				$_SESSION["PEDIDO"]["USUARIO"] = "CADASTRADO";
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] = array();
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"] = $return->model->fkCliente->codigoCliente;
				
				if ($return->model->fkCliente->Pessoa == 0) {
					$_cadastradoCpf = $return->model->fkCliente->Cpf;
					$_nomeEntrega = $return->model->fkCliente->Nome;
						
				} else {
					$_cadastradoCnpj = $return->model->fkCliente->Cnpj;
					$_nomeEntrega = $return->model->fkCliente->RazaoSocial;
				}

				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] = $return->model->fkCliente->Pessoa == 1 ? "juridica":"fisica";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"] = $_nomeEntrega;
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = $return->model->fkCliente->Nome;
				
				$_dataNascimento = implode('-', array_reverse(explode('/', $return->model->fkCliente->DataNascimento)));
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = $_dataNascimento;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = date("d/m/Y", strtotime($_dataNascimento));
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = $return->model->fkCliente->Cpf;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = $return->model->fkCliente->Rg;
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = $return->model->fkCliente->RazaoSocial;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = $return->model->fkCliente->Cnpj;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = $return->model->fkCliente->InscricaoEstadual;
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"] = $return->model->fkCliente->Email;
				
				$_cep[0] = substr($return->model->fkCliente->Cep, 0, 5);
				$_cep[1] = substr($return->model->fkCliente->Cep, -3, 3);
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"] = $_cep[0];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"] = $_cep[1];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"] = $_cep[0] . $_cep[1];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"] = $_cep[0] . "-" . $_cep[1];
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"] = $return->model->fkCliente->Logradouro;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"] = $return->model->fkCliente->Numero;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"] = $return->model->fkCliente->Complemento;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"] = $return->model->fkCliente->Bairro;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"] = $return->model->fkCliente->Municipio;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"] = $return->model->fkCliente->Uf;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"] = $return->model->fkCliente->Ddd1;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"] = $return->model->fkCliente->Telefone1;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"] = $return->model->fkCliente->Ddd2;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"] = $return->model->fkCliente->Telefone2;
				
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"] = $return->model->fkCliente->InformacoesReferencia;

				$_SESSION["ENTREGA"]["cep1"] = $_cep[0];
				$_SESSION["ENTREGA"]["cep2"] = $_cep[1];
				$_SESSION["ENTREGA"]["cep_completo"] = $_cep[0] . $_cep[1];
				$_SESSION["ENTREGA"]["cep_completo_formatado"] = $_cep[0] . "-" . $_cep[1];
				
				$_SESSION["ENTREGA"]["nome"] = $_nomeEntrega;
				
				$_SESSION["ENTREGA"]["endereco"] = $return->model->fkCliente->Logradouro;
				$_SESSION["ENTREGA"]["numero"] = $return->model->fkCliente->Numero;
				$_SESSION["ENTREGA"]["complemento"] = $return->model->fkCliente->Complemento;
				$_SESSION["ENTREGA"]["bairro"] = $return->model->fkCliente->Bairro;
				$_SESSION["ENTREGA"]["cidade"] = $return->model->fkCliente->Municipio;
				$_SESSION["ENTREGA"]["uf"] = $return->model->fkCliente->Uf;
				$_SESSION["ENTREGA"]["informacoes_referencia"] = $return->model->fkCliente->InformacoesReferencia;
				
				
				$pedido['codigoPedido'] = $return->model->codigoPedido;

				$_SESSION["PEDIDO"]["codigo"] = $pedido['codigoPedido'];
				$_SESSION["PEDIDO"]["email"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"];
				
				echo "<script> parent.window.location.href='../carrinhoPagamento'; </script>";
			}
			
		}else{
			echo "<script> alert('Inválido! É necessário o preenchimento do email e da senha para continuar!'); </script>";
			echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
		}
	
	//CLIENTE NOVO
	}else if ($_GET["acao"]=="novo"){
		error_reporting(0);
		ini_set("display_errors", 0);
		
		if (count($_SESSION["CART"])==0) {
			echo "<script> alert('Carrinho vazio.'); </script>";
			echo "<script> parent.window.location.href='../produtos'; </script>";
			die();
		}
		
		if (validaEmail(@$_POST["email-cadastro"])){
			$_arrayCliente = array(
				'email' => @$_POST["email-cadastro"]
    		);
    		$return = sendWsLogin($_arrayCliente, UrlWs . "pesquisarEmailCliente");
    		
    		if ($return->model == null) {
				$_SESSION["email"] = @$_POST["email-cadastro"];
				
				echo "<script> parent.window.location.href='../carrinhoCadastro'; </script>";
			} else {
				echo "<script> alert('Já existe um usuário cadastrado com esse e-mail.'); </script>";
				echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
				die();
			}	
			
		} else {
			echo "<script> alert('E-mail inválido.'); </script>";
			echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
			die;
		}
	
	//ESQUECI MINHA SENHA
	} else if ($_GET["acao"]=="esqueci") {	
		if ($_GET["email"] != "") {
			$_arrayCliente = array(
				'email' => @$_GET["email"]
    		);
    		$return = sendWsLogin($_arrayCliente, UrlWs . "pesquisarEmailCliente");
    		if ($return->model == null) {
				echo "<script> alert('Esse e-mail não consta no cadastro.'); </script>";
				echo "<script> window.close(); </script>";
				echo "<script> window.location.href='../carrinhoLogin'; </script>";
			} else {
				$usuario = 'plander@plander.com.br';
				$senha = 'ZION16equip!';
				$nomeRemetente = "Plander";
				$destinatarios = $return->model->Email;
				$nomeDestinatario = $return->model->Nome;
				$assunto = "Mensagem site Plander";
				$_conteudo = "<strong>Solicita&ccedil;&atilde;o de senha</strong><br><br><br>";
				
				if ($return->model->senhaCliente != "") {
					$_conteudo .= "Ol&aacute; <strong>" . $return->model->Nome . "</strong>, estamos enviando sua senha conforme foi solicitado.<br><br>";
					$_conteudo .= "Usu&aacute;rio: <strong>" . $return->model->Email . "</strong><br>";
					$_conteudo .= "Senha: <strong>" . $return->model->senhaCliente . "</strong><br><br><br>";
					$_conteudo .= "Agradecemos a prefer&ecirc;ncia<br>PLANDER.";
					@$_POST['mensagem'] = $_conteudo;
							
				} else {
					$senhaCliente = geraSenha(8, true, false, false);
					$cliente = array(
				    	'codigoCliente' => $return->model->codigoCliente,
				    	'senhaCliente' => $senhaCliente
				    );

				    
				    $jsoncliente = json_encode($cliente);
					$return = sendWsJson($jsoncliente, UrlWs . "atualizarSenhaCliente");
					if ($return->codStatus != 1) {
						unset($_SESSION['PEDIDO']);
						unset($_SESSION["ENTREGA"]);
						unset($_SESSION["email"]);

						echo "<script> alert('Falha ao gerar nova senha'); </script>";
						echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
						die();
					}
					$_conteudo .= "Ol&aacute; <strong>" . $return->model->Nome . "</strong>, estamos enviando uma nova senha.<br><br>";
					$_conteudo .= "Usu&aacute;rio: <strong>" . $return->model->Email . "</strong><br>";
					$_conteudo .= "Senha: <strong>" . $return->model->senhaCliente . "</strong><br><br><br>";
					$_conteudo .= "Agradecemos a prefer&ecirc;ncia<br>PLANDER.";
					@$_POST['mensagem'] = $_conteudo;
										
				}
					
				if (sendEmail($return->model->Email, $assunto, @$_POST['mensagem']) == 0){
					echo "<script> alert('Ops, houve um erro no envio do email.'); </script>";
					echo "<script> window.location.href='../carrinhoLogin'; </script>";
					die();
				}

				echo "<script> alert('E-mail enviado com sucesso. Verifique sua caixa de entrada.'); </script>";
				echo "<script> window.location.href='../carrinhoLogin'; </script>";	
				/*	
				$mail = new PHPMailer();
				$mail->SetLanguage("br"); // Define o Idioma
				$mail->CharSet = "utf-8"; // Define a Codifica��o
				$mail->IsSMTP(); // Define que ser� enviado por SMTP
				$mail->Host = "smtp.plander.com.br"; // Servidor SMTP
				$mail->SMTPAuth = true; // Caso o servidor SMTP precise de autentica��o
				$mail->Port = "587";
				$mail->Username = 'plander@plander.com.br'; // account username
				$mail->Password = 'ZION16equip!'; // account password
				$mail->IsHTML(true);
				$mail->From = "plander@plander.com.br"; // Define o Remetente
				$mail->FromName = "PLANDER"; // Nome do Remetente

				$mail->AddAddress($return->model->Email, "");

				$mail->Subject = $assunto; // Define o Assunto
				$mail->Body = @$_POST['mensagem']; // Corpo da mensagem em formato HTML
				$mail->SMTPDebug = 1;

				if(!$mail->Send()) {

					
					echo "<script> alert('Ocorreu algum erro durante a operação. Tente novamente.'); </script>";
					echo "<script> window.location.href='../carrinhoLogin'; </script>";
				} else {
					echo "<script> alert('E-mail enviado com sucesso. Verifique sua caixa de entrada.'); </script>";
					echo "<script> window.location.href='../carrinhoLogin'; </script>";
				}*/
			}
				
		} else {
			echo "<script> alert('Insira seu e-mail.'); </script>";
			echo "<script> window.close(); </script>";  
		}
	}			  
?>