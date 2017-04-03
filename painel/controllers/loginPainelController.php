<?php
include '../util/constantes.php';
include '../util/funcoesWS.php';
include '../util/funcoes.php';
include '../util/PHPMailer-master/class.phpmailer.php';
// session_start();
date_default_timezone_set ( 'America/Sao_Paulo' );
if (isset ( $_POST ["email-login"] ) && isset ( $_POST ["senha-login"] )) {
	$lp = new loginPainel ();
	$lp->logar ( $_POST ["email-login"], $_POST ["senha-login"] );
} elseif (isset ( $_POST ["email-cadastro"] )) {
	error_reporting ( 0 );
	ini_set ( "display_errors", 0 );
	
	$_arrayCliente = array (
			'email' => @$_POST ["email-cadastro"],
			'usr' => 'pdroqtl',
			'pwd' => 'jck9com*' 
	);
	$return = sendWsLogin ( $_arrayCliente, UrlWs . "pesquisarEmailClienteSimple" );
	if ($return != null) {
		if ($return->codStatus == 1) {
			echo "<script> alert('Já existe um usuário cadastrado com esse e-mail.'); </script>";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
			die ();
		} else if ($return->codStatus == 2) {
			$_SESSION ["email"] = $_POST ["email-cadastro"];
			$_SESSION["PEDIDO"]["USUARIO"] = "NOVO";
// 			$_SESSION ["TIPO_USUARIO"] = "NOVO";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/editarpf'; </script>";
			die ();
		} else {
			$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
			$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
			$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
			$_conteudo .= "<strong>Página Anterior: </strong>" . (isset ( $_SERVER ['HTTP_REFERER'] ) ? $_SERVER ['HTTP_REFERER'] : "Não identificada") . "<br><br>";
			$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
			$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
			$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
			$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
			$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
			sendEmailLog ( $_conteudo );
			echo "<script> alert('Ops, houve um erro de comunicação no servidor. Tente novamente!'); </script>";
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
			die ();
		}
		die ();
	} else {
		echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
		die ();
	}
}  // ESQUECI MINHA SENHA
else if ($_GET ["acao"] == "esqueci") {
	if ($_GET ["email"] != "") {
		$_arrayCliente = array (
				'email' => $_GET ["email"],
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*' 
		);
		$return = sendWsLogin ( $_arrayCliente, UrlWs . "pesquisarEmailCliente" );
		
		if ($return != null) {
			if ($return->codStatus > 4) {
				$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
				$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
				$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
				$_conteudo .= "<strong>Página Anterior: </strong>" . (isset ( $_SERVER ['HTTP_REFERER'] ) ? $_SERVER ['HTTP_REFERER'] : "Não identificada") . "<br><br>";
				$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
				$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
				$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
				$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
				$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
				sendEmailLog ( $_conteudo );
				echo "<script> alert('Ops, houve um erro de comunicação no servidor. Tente novamente!'); </script>";
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
			} elseif ($return->codStatus == 2) {
				echo "<script> alert('Esse e-mail não consta no cadastro.'); </script>";
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
			} elseif ($return->codStatus == 3) {
				echo "<script> alert('Há uma duplicidade em seu cadastro. Favor entrar em contato com a Plander informando seu email: Telefone (41) 3323 3636 ou Whatsapp (41) 99896-1818.'); </script>";
				$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
				$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
				$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
				$_conteudo .= "<strong>Página Anterior: </strong>" . (isset ( $_SERVER ['HTTP_REFERER'] ) ? $_SERVER ['HTTP_REFERER'] : "Não identificada") . "<br><br>";
				$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
				$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
				$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
				$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
				$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
				sendEmailLog ( $_conteudo );
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
			} else {
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
					@$_POST ['mensagem'] = $_conteudo;
				} else {
					$senhaCliente = geraSenha ( 8, true, false, false );
					$cliente = array (
							'codigoCliente' => $return->model->codigoCliente,
							'senhaCliente' => $senhaCliente,
							'usr' => 'pdroqtl',
							'pwd' => 'jck9com*' 
					);
					
					$jsoncliente = json_encode ( $cliente );
					$return = sendWsJson ( $jsoncliente, UrlWs . "atualizarSenhaCliente" );
					if ($return != null) {
						if ($return->codStatus != 1) {
							$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
							$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
							$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
							$_conteudo .= "<strong>Página Anterior: </strong>" . (isset ( $_SERVER ['HTTP_REFERER'] ) ? $_SERVER ['HTTP_REFERER'] : "Não identificada") . "<br><br>";
							$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
							$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
							$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
							$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
							$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
							sendEmailLog ( $_conteudo );
							echo "<script> alert('Falha ao gerar nova senha'); </script>";
							echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/logout'; </script>";
							die ();
						}
					} else {
						echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/logout'; </script>";
						die ();
					}
					
					$_conteudo .= "Olá <strong>" . $return->model->Nome . "</strong>, estamos enviando uma nova senha.<br><br>";
					$_conteudo .= "Usuário: <strong>" . $return->model->Email . "</strong><br>";
					$_conteudo .= "Senha: <strong>" . $return->model->senhaCliente . "</strong><br><br><br>";
					$_conteudo .= "Agradecemos a prefer&ecirc;ncia<br>PLANDER.";
					@$_POST ['mensagem'] = $_conteudo;
				}
				
				$sendEmail = sendEmail ( $return->model->Email, $assunto, @$_POST ['mensagem'] );
				if ($sendEmail != 1) {
					$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $sendEmail . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . (isset ( $_SERVER ['HTTP_REFERER'] ) ? $_SERVER ['HTTP_REFERER'] : "Não identificada") . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
					sendEmailLog ( $_conteudo );
					
					echo "<script> alert('Ops, houve um erro no envio do email.'); </script>";
					echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/logout'; </script>";
					die ();
				}
				
				echo "<script> alert('E-mail enviado com sucesso. Verifique sua caixa de entrada.'); </script>";
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/logout'; </script>";
			}
			die ();
		} else {
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/logout'; </script>";
			die ();
		}
	} else {
		echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
	}
}
class loginPainel {
	function __construct() {
	}
	public function logar($usr, $pwd) {
		$arrayCliente = array (
				'Email' => $usr,
				'senhaCliente' => $pwd,
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*' 
		);
		
		$objJson = json_encode ( $arrayCliente );
		$return = sendWsJson ( $objJson, UrlWs . "loginPainel" );
		
		if ($return != null) {
			if ($return->codStatus != 1 && $return->codStatus != 3) {
				
				switch ($return->codStatus) {
					case 2 :
						echo "<script> alert('Falha no Login: $return->msg.'); </script>";
						break;
					default :
						$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
						$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
						$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
						$_conteudo .= "<strong>Página Anterior: </strong>" . (isset ( $_SERVER ['HTTP_REFERER'] ) ? $_SERVER ['HTTP_REFERER'] : "Não identificada") . "<br><br>";
						$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
						$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
						$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
						$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
						$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
						sendEmailLog ( $_conteudo );
						echo "<script> alert('Ops, $return->msg. Você será direcionado ao login novamente!'); </script>";
						break;
				}
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
				die ();
			} else {
				
// 				popularSessaoPadrao ($return->model [0]->fkCliente);
				
				$_SESSION ["PEDIDO"]["USUARIO"] = "CADASTRADO";
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] = array();
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"] = $return->model[0]->fkCliente->codigoCliente;
					
				if ($return->model[0]->fkCliente->Pessoa == 0) {
					$_cadastradoCpf = $return->model[0]->fkCliente->Cpf;
					$_nomeEntrega = $return->model[0]->fkCliente->Nome;
				
				} else {
					$_cadastradoCnpj = $return->model[0]->fkCliente->Cnpj;
					$_nomeEntrega = $return->model[0]->fkCliente->RazaoSocial;
				}
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] = $return->model[0]->fkCliente->Pessoa == 1 ? "juridica":"fisica";
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"] = $_nomeEntrega;
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = $return->model[0]->fkCliente->Nome;
					
				$_dataNascimento = implode('-', array_reverse(explode('/', $return->model[0]->fkCliente->DataNascimento)));
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = $_dataNascimento;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = date("d/m/Y", strtotime($_dataNascimento));
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = $return->model[0]->fkCliente->Cpf;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = $return->model[0]->fkCliente->Rg;
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = $return->model[0]->fkCliente->RazaoSocial;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = $return->model[0]->fkCliente->Cnpj;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = $return->model[0]->fkCliente->InscricaoEstadual;
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"] = $return->model[0]->fkCliente->Email;
					
				$_cep[0] = substr($return->model[0]->fkCliente->Cep, 0, 5);
				$_cep[1] = substr($return->model[0]->fkCliente->Cep, -3, 3);
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"] = $_cep[0];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"] = $_cep[1];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"] = $_cep[0] . $_cep[1];
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"] = $_cep[0] . "-" . $_cep[1];
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"] = $return->model[0]->fkCliente->Logradouro;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"] = $return->model[0]->fkCliente->Numero;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"] = $return->model[0]->fkCliente->Complemento;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"] = $return->model[0]->fkCliente->Bairro;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"] = $return->model[0]->fkCliente->Municipio;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"] = $return->model[0]->fkCliente->Uf;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"] = $return->model[0]->fkCliente->Ddd1;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"] = $return->model[0]->fkCliente->Telefone1;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"] = $return->model[0]->fkCliente->Ddd2;
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"] = $return->model[0]->fkCliente->Telefone2;
					
				$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"] = $return->model[0]->fkCliente->InformacoesReferencia;
					
				$_SESSION["ENTREGA"]["cep1"] = $_cep[0];
				$_SESSION["ENTREGA"]["cep2"] = $_cep[1];
				$_SESSION["ENTREGA"]["cep_completo"] = $_cep[0] . $_cep[1];
				$_SESSION["ENTREGA"]["cep_completo_formatado"] = $_cep[0] . "-" . $_cep[1];
					
				$_SESSION["ENTREGA"]["nome"] = $_nomeEntrega;
					
				$_SESSION["ENTREGA"]["endereco"] = $return->model[0]->fkCliente->Logradouro;
				$_SESSION["ENTREGA"]["numero"] = $return->model[0]->fkCliente->Numero;
				$_SESSION["ENTREGA"]["complemento"] = $return->model[0]->fkCliente->Complemento;
				$_SESSION["ENTREGA"]["bairro"] = $return->model[0]->fkCliente->Bairro;
				$_SESSION["ENTREGA"]["cidade"] = $return->model[0]->fkCliente->Municipio;
				$_SESSION["ENTREGA"]["uf"] = $return->model[0]->fkCliente->Uf;
				$_SESSION["ENTREGA"]["informacoes_referencia"] = $return->model[0]->fkCliente->InformacoesReferencia;
					
				$_SESSION ["CLIENTE"] ["listaPedidos"] = array ();
				
				if ($return->codStatus != 3) {
					foreach ( $return->model as $key => $value ) {
						$pedido = array (
								"codigoPedido" => $value->codigoPedido,
								"Data" => new DateTime ( $value->Data ),
								"EntregaNome" => $value->EntregaNome,
								"EntregaRua" => $value->EntregaRua,
								"EntregaNumero" => $value->EntregaNumero,
								"EntregaComplemento" => $value->EntregaComplemento,
								"EntregaBairro" => $value->EntregaBairro,
								"EntregaMunicipio" => $value->EntregaMunicipio,
								"EntregaUf" => $value->EntregaUf,
								"EntregaCep" => $value->EntregaCep,
								"EntregaInformacoesReferencia" => $value->EntregaInformacoesReferencia,
								
								"FormaPagamento" => $value->FormaPagamento,
								"DataVencimento" => $value->DataVencimento,
								"NumeroParcelas" => $value->NumeroParcelas,
								"ValorParcelas" => $value->ValorParcelas,
								"CartaoTitular" => $value->CartaoTitular,
								"CartaoNumero" => $value->CartaoNumero,
								"CartaoValidade" => $value->CartaoValidade,
								"CartaoCodigoSeguranca" => $value->CartaoCodigoSeguranca,
								
								"ValorOutros" => $value->ValorOutros,
								"ValorDesconto" => $value->ValorDesconto,
								"TipoFrete" => $value->TipoFrete,
								"ValorFrete" => $value->ValorFrete,
								"ValorFinal" => $value->ValorFinal,
								"CodigoRastreio" => $value->Rastreador,
								"Processo" => $value->Processo,
								
								"Cliente" => array (
										"codigoCliente" => $value->fkCliente->codigoCliente,
										"Nome" => $value->fkCliente->Nome,
										"Cpf" => $value->fkCliente->Cpf,
										"Rg" => $value->fkCliente->Rg,
										"Logradouro" => $value->fkCliente->Logradouro,
										"Municipio" => $value->fkCliente->Municipio,
										"Uf" => $value->fkCliente->Uf,
										"Bairro" => $value->fkCliente->Bairro,
										"Numero" => $value->fkCliente->Numero,
										"Complemento" => $value->fkCliente->Complemento,
										"Cep" => $value->fkCliente->Cep,
										"Ddd1" => $value->fkCliente->Ddd1,
										"Ddd2" => $value->fkCliente->Ddd2,
										"Telefone1" => $value->fkCliente->Telefone1,
										"Telefone2" => $value->fkCliente->Telefone2,
										
										"Email" => $value->fkCliente->Email,
										"sexoCliente" => $value->fkCliente->sexoCliente,
										"DataNascimento" => $value->fkCliente->DataNascimento,
										"Pessoa" => $value->fkCliente->Pessoa,
										"Cnpj" => $value->fkCliente->Cnpj,
										"InscricaoEstadual" => $value->fkCliente->InscricaoEstadual,
										"paisCliente" => $value->fkCliente->paisCliente,
										"codigoPaisCliente" => $value->fkCliente->codigoPaisCliente,
										"codigoMunicipioCliente" => $value->fkCliente->codigoMunicipioCliente,
										"InformacoesReferencia" => $value->fkCliente->InformacoesReferencia 
								) 
						);
						
						$lstItems = array ();
						foreach ( $value->lstItems as $ind => $elem ) {
							$item = array (
									"codigoProdutoGrade" => $elem->codigoProdutoGrade,
									"quantidade" => $elem->quantidade,
									"valorUnitario" => $elem->valorUnitario,
									"descricao" => $elem->descricao 
							);
							array_push ( $lstItems, $item );
						}
						$pedido ["lstItens"] = $lstItems;
						array_push ( $_SESSION ["CLIENTE"] ["listaPedidos"], $pedido );
					}
				}
				
				echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/pedidos'; </script>";
				die ();
			}
		} else {
			echo "<script> parent.window.location.href='" . UrlSite . BasePainel . "/loginPainel'; </script>";
			die ();
		}
	}
}


function popularSessaoPadrao($cliente) {
	$_SESSION ["PEDIDO"] ["USUARIO"] = "CADASTRADO";
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] = array ();
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["codigo"] = $cliente->codigoCliente;
	
	if ($cliente->Pessoa == 0) {
		$_cadastradoCpf = $cliente->Cpf;
		$_nomeEntrega = $cliente->Nome;
	} else {
		$_cadastradoCnpj = $cliente->Cnpj;
		$_nomeEntrega = $cliente->RazaoSocial;
	}
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["pessoa"] = $cliente->Pessoa == 1 ? "juridica" : "fisica";
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["nome_principal"] = $_nomeEntrega;
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["nome"] = $cliente->Nome;
	
	$_dataNascimento = implode ( '-', array_reverse ( explode ( '/', $cliente->DataNascimento ) ) );
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["data_nascimento"] = $_dataNascimento;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["data_nascimento_formatada"] = date ( "d/m/Y", strtotime ( $_dataNascimento ) );
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cpf"] = $cliente->Cpf;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["rg"] = $cliente->Rg;
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["razao_social"] = $cliente->RazaoSocial;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cnpj"] = $cliente->Cnpj;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["ie"] = $cliente->InscricaoEstadual;
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["email"] = $cliente->Email;
	
	$_cep [0] = substr ( $cliente->Cep, 0, 5 );
	$_cep [1] = substr ( $cliente->Cep, - 3, 3 );
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cep1"] = $_cep [0];
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cep2"] = $_cep [1];
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cep_completo"] = $_cep [0] . $_cep [1];
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cep_completo_formatado"] = $_cep [0] . "-" . $_cep [1];
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["endereco"] = $cliente->Logradouro;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["numero"] = $cliente->Numero;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["complemento"] = $cliente->Complemento;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["bairro"] = $cliente->Bairro;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["cidade"] = $cliente->Municipio;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["uf"] = $cliente->Uf;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["ddd1"] = $cliente->Ddd1;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["telefone1"] = $cliente->Telefone1;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["ddd2"] = $cliente->Ddd2;
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["telefone2"] = $cliente->Telefone2;
	
	$_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["informacoes_referencia"] = $cliente->InformacoesReferencia;
	
	$_SESSION ["ENTREGA"] ["cep1"] = $_cep [0];
	$_SESSION ["ENTREGA"] ["cep2"] = $_cep [1];
	$_SESSION ["ENTREGA"] ["cep_completo"] = $_cep [0] . $_cep [1];
	$_SESSION ["ENTREGA"] ["cep_completo_formatado"] = $_cep [0] . "-" . $_cep [1];
	
	$_SESSION ["ENTREGA"] ["nome"] = $_nomeEntrega;
	
	$_SESSION ["ENTREGA"] ["endereco"] = $cliente->Logradouro;
	$_SESSION ["ENTREGA"] ["numero"] = $cliente->Numero;
	$_SESSION ["ENTREGA"] ["complemento"] = $cliente->Complemento;
	$_SESSION ["ENTREGA"] ["bairro"] = $cliente->Bairro;
	$_SESSION ["ENTREGA"] ["cidade"] = $cliente->Municipio;
	$_SESSION ["ENTREGA"] ["uf"] = $cliente->Uf;
	$_SESSION ["ENTREGA"] ["informacoes_referencia"] = $cliente->InformacoesReferencia;
		
	$_SESSION ["email"] = $_SESSION [$_SESSION ["PEDIDO"] ["USUARIO"]] ["email"];
}
