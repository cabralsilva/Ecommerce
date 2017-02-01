<?php
	session_start();
	
	include("../class/constantes.php");
	include("../class/filemaker.class.php");
	include("../actions/funcoes.php");
	
	include("../class/PHPMailer-master/class.phpmailer.php");
	
	if($_SESSION["PEDIDO"]["codigo"] != ""){
		$_html = "
		<!DOCTYPE html>
		<html>
		  <head>
		    <meta charset=\"utf-8\">
		    <title>Confirmação de compra - Plander.com</title>
		  </head>
		  <body>
		    <center>
		      <table bgcolor=\"FAFAFA\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: Arial, sans-serif; color: #313131\">
		        <tbody>
		          <tr>
		            <td height=\"50\" align=\"center\"><p style=\"font-size: 10px; color: #B7B7B7\">Este é um e-mail automático, não é necessário respondê-lo.</p></td>
		          </tr>
		          <tr>
		            <td><a href=\"" . URL . "\" title=\"Visitar o site da Plander\"><img border=\"0\" width=\"600\" height=\"84\" src=\"http://clientes.coopers.pro/plander/imagens/email-topo.jpg\" alt=\"Plander.com\"></td></a>
		          </tr>
		          <tr>
		            <td>
		              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">
		                <tr>
		                  <td width=\"30\"></td>
		                  <td>
		                    <!-- abre corpo da mensagem -->
		                    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">
		                      <tr>
		                        <td align=\"center\">
		                          <br>
		                          <p style=\"font-size: 20px\">
		                            <strong>Obrigado por escolher a Plander.com.</strong><br>
		                            <span style=\"font-size: 17px\">Seu pedido foi realizado com sucesso - Número <span style=\"text-decoration: underline; color: #4A90E2\">" . $_SESSION["PEDIDO"]["codigo"] . "</span></span>
		                          </p>
		                          <br>
		                        </td>
		                      </tr>
		                      <tr>
		                        <td align=\"center\" style=\"border-top: 1px solid #E2E2E2\">
		                          <br><br>
		                          <img width=\"314\" height=\"58\" src=\"http://clientes.coopers.pro/plander/imagens/email-passos-pedido.png\" alt=\"Pedido realizado\">
		                          <br><br><br>";
		                          
		                          	if ($_SESSION["PEDIDO"]["forma_pagamento"]=="boleto"){
		                          		$_html .= "<a href=\"" . URL . "boleto/boleto_bradesco.php?id=" . $_SESSION["PEDIDO"]["codigo"] . "\" target=\"_blank\" title=\"Imprimir boleto\"><img src=\"http://clientes.coopers.pro/plander/imagens/email-botao-imprimir.jpg\" alt=\"Imprimir boleto\" border=\"0\" width=\"212\" height=\"41\"></a>";
		                          		$_html .= "<br>";
		                          		$_html .= "<em style=\"font-size: 11px; color: #9B9B9B\">Caso não tenha impresso seu boleto, clique no link acima.</em>";
		                          	}
		                          
		                          $_html .= "<br><br><br><br>
		                          <!-- abre tabela com os pedidos -->
		                          <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\">
		                            <thead>
		                              <tr>
		                                <th height=\"30\" align=\"left\" colspan=\"3\" style=\"font-size: 16px; color: #4A90E2; border-bottom: 1px solid #E2E2E2\">Previsão de entrega</th>
		                              </tr>
		                              <tr>
		                                <td height=\"30\">Produto</td>
		                                <td align=\"center\" height=\"50\">Qtd.</td>
		                                <td align=\"center\" height=\"50\">Valor total</td>
		                              </tr>
		                            </thead>
		                            <tbody>";
		                              
						              	$_chaves = array_keys($_SESSION["CART"]);
										
										for($_i = 0; $_i < count($_chaves); $_i++) {
											$_html .= "<td width=\"350\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" cellpadding>";
						                  	$_html .= $_SESSION["CART"][$_chaves[$_i]]["descricao"];
							                $_html .= "</td>";
											$_html .= "<td width=\"50\" bgcolor=\"#ffffff\" style=\"font-size: 12px;\" align=\"center\">";
							                $_html .= $_SESSION["CART"][$_chaves[$_i]]["quantidade"];
											$_html .= "</td>";
											$_html .= "<td width=\"120\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\">";
							                $_html .= "R$ " . number_format(($_SESSION["CART"][$_chaves[$_i]]["valor"]*$_SESSION["CART"][$_chaves[$_i]]["quantidade"]),2,",",".");
											$_html .= "</td>";
							          		$_html .= "</tr>";
										}
		                            
		                            $_html .= "</tbody>
		                          </table>
		                          <!-- fecha tabela com os pedidos -->
		                          <br><br>
		                          <!-- abre endereco -->
		                          <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\">
		                            <thead>
		                              <tr>
		                                <th height=\"30\" align=\"left\" style=\"font-size: 16px; color: #4A90E2; border-bottom: 1px solid #E2E2E2\">Endereço de entrega</th>
		                              </tr>
		                            </thead>
		                            <tbody>
		                              <tr>
		                                <td style=\"font-size: 14px\">";
		                                
		                                	$_html .= $_SESSION["ENTREGA"]["nome"] . "<br>";
											$_html .= $_SESSION["ENTREGA"]["endereco"];
											$_html .= $_SESSION["ENTREGA"]["numero"]!=""?", " . $_SESSION["ENTREGA"]["numero"]:"";
											$_html .= $_SESSION["ENTREGA"]["complemento"]!=""?" - " . $_SESSION["ENTREGA"]["complemento"]:"";
											$_html .= "<br>";
											$_html .= $_SESSION["ENTREGA"]["bairro"] . " - " . $_SESSION["ENTREGA"]["cidade"] . " - " . $_SESSION["ENTREGA"]["uf"];
											$_html .= "<br>";
											$_html .= $_SESSION["ENTREGA"]["cep"];
											$_html .= "<br>";
											$_html .= $_SESSION["ENTREGA"]["informacoes_referencia"];
										
		                                $_html .= "</td>
		                              </tr>
		                            </tbody>
		                          </table>
		                          <!-- fecha endereco -->
		                          <br><br>
		                          <!-- abre atendimento -->
		                          <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\">
		                            <thead>
		                              <tr>
		                                <th colspan=\"2\" height=\"30\" align=\"left\" style=\"font-size: 16px; color: #4A90E2; border-bottom: 1px solid #E2E2E2\">Atendimento</th>
		                              </tr>
		                            </thead>
		                            <tbody>
		                              <tr>
		                                <td style=\"font-size: 14px; line-height: 17px\">
		                                  <br>
		                                  (41) 3323-3636<br>
		                                  <img width=\"17\" height=\"17\" src=\"http://clientes.coopers.pro/plander/imagens/email-whatsapp.png\" valign=\"middle\" alt=\"WhatsApp\"> (41) 9896-3636<br>
		                                  plander@plander.com.br
		                                </td>
		                                <td width=\"200\">
		                                  <br>
		                                  <a href=\"" . URL . "faleConosco.php\" title=\"Entrar em contato com a Plander\"><img src=\"http://clientes.coopers.pro/plander/imagens/email-botao-fale-conosco.png\" alt=\"Fale Conosco\" border=\"0\" width=\"191\" height=\"40\"></a>
		                                </td>
		                              </tr>
		                            </tbody>
		                          </table>
		                          <!-- fecha atendimento -->
		                          <br><br>
		                        </td>
		                      </tr>
		                    </table>
		                    <!-- fecha corpo da mensagem -->
		                  </td>
		                  <td width=\"30\"></td>
		                </tr>
		              </table>
		            </td>
		          </tr>
		          <tr>
		            <td height=\"90\" bgcolor=\"#003F6A\"></td>
		          </tr>
		        </tbody>
		      </table>
		    </center>
		  </body>
		</html>";
		
		$sendEmail = sendEmail($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"], "Compra " . $_SESSION["PEDIDO"]["codigo"] . "!", $_html);
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
		}

	}else{
		echo "<script> alert('Houve um erro no envio do email.'); </script>";
	}
	
	echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
?>