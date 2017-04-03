<?php
require_once 'funcoes.php';
require_once 'funcoesWS.php';
class Integracao{
	function __construct() {
		
	}
	public function logarPainelBySessaoCarrinho() {
		
		$arrayCliente = array (
				'codigoCliente' => $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"],
				'usr' => 'pdroqtl',
				'pwd' => 'jck9com*'
		);
		
		$objJson = json_encode ( $arrayCliente );
		$return = sendWsJson ( $objJson, UrlWs . "loginPainelBySessaoCarrinho" );
		
		if ($return != null) {
			
			if ($return->codStatus != 1 && $return->codStatus != 3) {
				switch ($return->codStatus) {
					case 2 :
						echo "<script> alert('Falha no Login: $return->msg.'); </script>";
						echo "<script> parent.window.location.href='" . BasePainel . "/views/logout.php'; </script>";
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
						session_destroy();
						echo "<script> alert('Ops, $return->msg. Você será direcionado ao login novamente!'); </script>";
						break;
				}
				echo "<script> parent.window.location.href='" . BasePainel . "/views/loginPainel.php'; </script>";
				die ();
			} else {
				
				
		
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
		
// 				echo "<script> parent.window.location.href='" . BasePainel . "/views/painel.php'; </script>";
// 				die ();
			}
		} else {
			echo "<script> parent.window.location.href='" . BasePainel . "/views/loginPainel.php'; </script>";
			die ();
		}
	}
}