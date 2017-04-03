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
			    'lstItems' => $items,
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
    		);

    		$objJson = json_encode($arrayPedido);    	
    		print_r($objJson);
    		$return = sendWsJson($objJson, UrlWs . "novologin");
			if ($return->codStatus != 1) {
				if($return != null){
					switch ($return->codStatus) {
						case 2:
							echo "<script> alert('Falha no Login: $return->msg.'); </script>";
							break;
						case 3:
							$_SESSION["PEDIDO"]["USUARIO"] = "CADASTRADO";
				
							$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] = array();
							
							$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"] = $return->model->fkCliente->codigoCliente;
							
							if ($return->model->fkCliente->Pessoa == 0) {
								$_cadastradoCpf = $return->model->fkCliente->Cpf;
								$_nomeEntrega = $return->model->fkCliente->Nome;
									
							} elseif ($return->model->fkCliente->Pessoa == 0) {
								$_cadastradoCnpj = $return->model->fkCliente->Cnpj;
								$_nomeEntrega = $return->model->fkCliente->RazaoSocial;
							} else{
								$_cadastradoCnpj = "";
								$_nomeEntrega = "";
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
							$_SESSION["MSG_INCOMPLETO"] = $return->msg;
							echo "<script> parent.window.location.href='../carrinhoCadastro'; </script>";
							die();
							break;
						default:
							$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
							$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
							$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
							$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
							$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
							$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
							$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
							$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
							$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
							sendEmailLog($_conteudo);
							echo "<script> alert('Ops, falha ($return->codStatus). Você será direcionado ao login novamente!'); </script>";
							break;
					}
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
				'email' => @$_POST["email-cadastro"],
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
    		);
    		$return = sendWsLogin($_arrayCliente, UrlWs . "pesquisarEmailCliente");
    		
    		if ($return != null){
    			if($return->codStatus <= 2){
    				if ($return->model == null) {
						$_SESSION["email"] = @$_POST["email-cadastro"];
						
						echo "<script> parent.window.location.href='../carrinhoCadastro'; </script>";
					} else {
						echo "<script> alert('Já existe um usuário cadastrado com esse e-mail.'); </script>";
						echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
					}	
    			}else {
    				$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
					sendEmailLog($_conteudo);
					echo "<script> alert('Ops, houve um erro de comunicação no servidor. Tente novamente!'); </script>";
					echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
    			}
    			die();
    		}else{
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
				'email' => @$_GET["email"],
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
    		);
    		$return = sendWsLogin($_arrayCliente, UrlWs . "pesquisarEmailCliente");
    		
    		if ($return != null){
    			if($return->codStatus > 4){
    				$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
					sendEmailLog($_conteudo);
					echo "<script> alert('Ops, houve um erro de comunicação no servidor. Tente novamente!'); </script>";
					echo "<script> window.location.href='../carrinhoLogin'; </script>";
    			}elseif ($return->codStatus == 2) {
					echo "<script> alert('Esse e-mail não consta no cadastro.'); </script>";
					echo "<script> window.close(); </script>";
					echo "<script> window.location.href='../carrinhoLogin'; </script>";
				}elseif ($return->codStatus == 3) {
					echo "<script> alert('Há uma duplicidade em seu cadastro. Favor entrar em contato com a Plander informando seu email: Telefone (41) 3323 3636 ou Whatsapp (41) 99896-1818.'); </script>";
					$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
					sendEmailLog($_conteudo);
					echo "<script> window.location.href='../carrinhoLogin'; </script>";
				}else{
    				$usuario = 'plander@plander.com.br';
					$senha = 'ZION16equip!';
					$nomeRemetente = "Plander";
					$destinatarios = $return->model->Email;
					$nomeDestinatario = $return->model->Nome;
					$assunto = "Solicitação de senha";
					$_conteudo = "<strong>Solicitação de senha</strong><br><br><br>";
					
					if ($return->model->senhaCliente != "") {
						$_conteudo .= "Olá <strong>" . $return->model->Nome . "</strong>, estamos enviando sua senha conforme foi solicitado.<br><br>";
						$_conteudo .= "Usuário: <strong>" . $return->model->Email . "</strong><br>";
						$_conteudo .= "Senha: <strong>" . $return->model->senhaCliente . "</strong><br><br><br>";
						$_conteudo .= "Agradecemos a preferência<br>PLANDER.";
						@$_POST['mensagem'] = $_conteudo;
								
					} else {
						$senhaCliente = geraSenha(8, true, false, false);
						$cliente = array(
					    	'codigoCliente' => $return->model->codigoCliente,
					    	'senhaCliente' => $senhaCliente,
							'usr' => 'pdroqtl',
							'pwd' => 'jck9com*'
					    );

					    
					    $jsoncliente = json_encode($cliente);
						$return = sendWsJson($jsoncliente, UrlWs . "atualizarSenhaCliente");
						if ($return != null){
							if ($return->codStatus != 1) {
								$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
								$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
								$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
								$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
								$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
								$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
								$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
								$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
								$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
								sendEmailLog($_conteudo);
								unset($_SESSION['PEDIDO']);
								unset($_SESSION["ENTREGA"]);
								unset($_SESSION["email"]);

								echo "<script> alert('Falha ao gerar nova senha'); </script>";
								echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
								die();
							}
						}else{
							echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
							die();
						}

						$_conteudo .= "Ol&aacute; <strong>" . $return->model->Nome . "</strong>, estamos enviando uma nova senha.<br><br>";
						$_conteudo .= "Usu&aacute;rio: <strong>" . $return->model->Email . "</strong><br>";
						$_conteudo .= "Senha: <strong>" . $return->model->senhaCliente . "</strong><br><br><br>";
						$_conteudo .= "Agradecemos a prefer&ecirc;ncia<br>PLANDER.";
						@$_POST['mensagem'] = $_conteudo;
											
					}
						
					$sendEmail = sendEmail($return->model->Email, $assunto, @$_POST['mensagem']);
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
						echo "<script> window.location.href='../carrinhoLogin'; </script>";
						die();
					}

					echo "<script> alert('E-mail enviado com sucesso. Verifique sua caixa de entrada.'); </script>";
					echo "<script> window.location.href='../carrinhoLogin'; </script>";	
    			}
    			die();
    		}else{
    			echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
				die;
    		}
				
		} else {
			echo "<script> alert('Insira seu e-mail.'); </script>";
			echo "<script> window.close(); </script>";  
		}
	}
?>