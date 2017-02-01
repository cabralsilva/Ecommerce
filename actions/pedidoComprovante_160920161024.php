<?php
	session_start();
	
	include("../class/constantes.php");
	include("../class/filemaker.class.php");
	include("../actions/funcoes.php");
	
	include("../class/PHPMailer-master/class.phpmailer.php");
	require_once("../actions/funcoesWS.php");
	
	$_achou = false;
	$_situacao = "pedido";

	if (@$_GET["id"]!=""){
		$_pedido = array();
		$_pedido['codigoPedido'] = @$_GET["id"];
		
		$_returnPedido = sendWsJson(json_encode($_pedido), UrlWs . "getPedidoCodigo");
		
		if ($_returnPedido->codStatus == 1){
			$_achou = true;

			$_pedidoId = $_returnPedido->model->codigoPedido;
			$_pedidoCodigo = $_returnPedido->model->codigoPedido;
			$_pedidoForma = $_returnPedido->model->FormaPagamento;
			$_pedidoEmail = $_returnPedido->model->ClienteEmail;
			$_pedidoNome = $_returnPedido->model->ClienteRazaoSocial!=""?$_returnPedido->model->ClienteRazaoSocial:$_returnPedido->model->ClienteNome;
			
			$_entregaNome = $_returnPedido->model->EntregaNome;
			$_entregaEndereco = $_returnPedido->model->EntregaRua;
			$_entregaNumero = $_returnPedido->model->EntregaNumero;
			$_entregaComplemento = $_returnPedido->model->EntregaComplemento;
			$_entregaBairro = $_returnPedido->model->EntregaBairro;
			$_entregaCidade = $_returnPedido->model->EntregaMunicipio;
			$_entregaUf = $_returnPedido->model->EntregaUf;
			$_entregaCep = $_returnPedido->model->EntregaCep;
			//$_entregaInformacoesReferencia = $_pedido->getField("EntregaInformacoesReferencia");

			$_returnItems = sendWsJson(json_encode($_pedido), UrlWs . "getItemPorCodigoPedido");
			
			if(count($_returnItems->model) > 0) {
				$_produtos = array();
				$_i = 0;
				foreach ($_returnItems->model as $_linhaPortal) {
					$_produtos[$_i]["descricao"] = $_linhaPortal->descricao;
					$_produtos[$_i]["quantidade"] = valorFM($_linhaPortal->quantidade);
					$_produtos[$_i]["valor"] = $_linhaPortal->valorUnitario;
					
					$_i++;
				}
			}
			
			$_subtotal = $_returnPedido->model->Subtotal;
			$_valorFrete = $_returnPedido->model->ValorFrete;
			$_valorTotal = $_returnPedido->model->ValorFinal;

		}
		
		if (@$_GET["situacao"]!="")
			$_situacao = @$_GET["situacao"];
	}else if(@$_SESSION["PEDIDO"]["codigo"]!=""){
		$_achou = true;
		
		$_pedidoId = $_SESSION["PEDIDO"]["codigo"];
		$_pedidoCodigo = $_SESSION["PEDIDO"]["codigo"];
		$_pedidoForma = $_SESSION["PEDIDO"]["forma_pagamento"];
		$_pedidoEmail = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"];
		$_pedidoNome = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"];
		
		$_entregaNome = $_SESSION["ENTREGA"]["nome"];
		$_entregaEndereco = $_SESSION["ENTREGA"]["endereco"];
		$_entregaNumero = $_SESSION["ENTREGA"]["numero"];
		$_entregaComplemento = $_SESSION["ENTREGA"]["complemento"];
		$_entregaBairro = $_SESSION["ENTREGA"]["bairro"];
		$_entregaCidade = $_SESSION["ENTREGA"]["cidade"];
		$_entregaUf = $_SESSION["ENTREGA"]["uf"];
		$_entregaCep = $_SESSION["ENTREGA"]["cep_completo_formatado"];
		$_entregaInformacoesReferencia = $_SESSION["ENTREGA"]["informacoes_referencia"];
		
		$_produtos = array();
		
		$_chaves = array_keys($_SESSION["CART"]);
		for($_i = 0; $_i < count($_chaves); $_i++) {
			
			$_produtos[$_i]["descricao"] = $_SESSION["CART"][$_chaves[$_i]]["descricao"];
			$_produtos[$_i]["quantidade"] = $_SESSION["CART"][$_chaves[$_i]]["quantidade"];
			$_produtos[$_i]["valor"] = $_SESSION["CART"][$_chaves[$_i]]["valor"];
		}
		
		$_subtotal = $_SESSION["PEDIDO"]["subtotal"];
		$_valorFrete = $_SESSION["PEDIDO"]["valor_frete"];
		$_valorTotal = $_subtotal+$_valorFrete;
	}
	
	if ($_achou){
		$_html = "
		<!DOCTYPE html>
		<html>
		  <head>
		    <meta charset=\"utf-8\">
		    <title>Confirmação de compra - Plander.com</title>
			<link rel=\"icon\" type=\"image/png\" href=\"". URL_SSL. "imagens/favicon.png\" />
		  </head>
		  <body>
		    <center>
		      <table bgcolor=\"FAFAFA\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: Arial, sans-serif; color: #313131\">
		        <tbody>
		          " . (@$_GET["email"]=="1"?"<tr>
		            <td height=\"50\" align=\"center\"><p style=\"font-size: 10px; color: #B7B7B7\">Este é um e-mail automático, não é necessário respondê-lo.</p></td>
		          </tr>":"") .
		          "<tr>
		            <td><a href=\"" . URL . "\" title=\"Visitar o site da Plander\"><img border=\"0\" width=\"600\" height=\"84\" src=\"" . URL_SSL .  "imagens/email-topo.jpg\" alt=\"Plander.com\"></td></a>
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
		                            <span style=\"font-size: 17px\">Seu pedido foi realizado com sucesso - Número <span style=\"text-decoration: underline; color: #4A90E2\">" . $_pedidoCodigo . "</span></span>
		                          </p>
		                          <br>
		                        </td>
		                      </tr>
		                      <tr>
		                        <td align=\"center\" style=\"border-top: 1px solid #E2E2E2\">
		                          <br><br>
		                          <img width=\"314\" height=\"58\" src=\"" . URL_SSL .  "imagens/email-passos-" . $_situacao . ".png\" alt=\"Pedido realizado\">
		                          <br><br><br>";
		                          	                          	
		                          $_html .= ($_pedidoForma=="boleto" && $_situacao=="pedido"?"<a href=\"" . URL . "boleto/boleto_bradesco.php?id=" . $_pedidoId . "\" target=\"_blank\" title=\"Imprimir boleto\"><img src=\"" . URL_SSL .  "imagens/email-botao-imprimir.jpg\" alt=\"Imprimir boleto\" border=\"0\" width=\"212\" height=\"41\"></a><br>":"");

		                          $_html .= ($_pedidoForma=="boleto" && $_situacao=="pedido"?"<em style=\"font-size: 11px; color: #9B9B9B\">Caso não tenha impresso seu boleto, clique no link acima.</em>":"");	                         
		                          
		                          $_html .= "<br><br><br><br>
		                          <!-- abre tabela com os pedidos -->
		                          <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\">
		                            <thead>
		                              <tr>
		                                <th height=\"30\" align=\"left\" colspan=\"3\" style=\"font-size: 16px; color: #4A90E2; border-bottom: 1px solid #E2E2E2\">Meu pedido</th>
		                              </tr>
		                              <tr>
		                                <td height=\"30\">Produto</td>
		                                <td align=\"center\" height=\"50\">Qtd.</td>
		                                <td align=\"right\" height=\"50\">Valor total</td>
		                              </tr>
		                            </thead>
		                            <tbody>";
		                              
										for($_i = 0; $_i < count($_produtos); $_i++) {
											$_html .= "<td width=\"350\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" cellpadding>";
						                  	$_html .= $_produtos[$_i]["descricao"];
							                $_html .= "</td>";
											$_html .= "<td width=\"50\" bgcolor=\"#ffffff\" style=\"font-size: 12px;\" align=\"center\">";
							                $_html .= $_produtos[$_i]["quantidade"];
											$_html .= "</td>";
											$_html .= "<td width=\"120\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\">";
							                $_html .= "R$ " . number_format(($_produtos[$_i]["valor"]*$_produtos[$_i]["quantidade"]),2,",",".");
											$_html .= "</td>";
							          		$_html .= "</tr>";
										}
		                            
		                            $_html .= "</tbody>
		                          </table>
		                          <!-- fecha tabela com os pedidos -->
		                          <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">
		                            <tbody>
		                              <tr>
		                                <td bgcolor=\"#ffffff\" style=\"border-bottom: 1px solid #E2E2E2\">&nbsp;</td>
		                              </tr>
		                            </tbody>
		                          </table>
		                          <table width=\"100%\" cellpadding=\"10\" cellspacing=\"0\">
		                            <tbody>
		                              <tr>
		                                <td width=\"350\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" cellpadding>&nbsp;</td>
		                                <td width=\"50\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\">Subtotal</td>
		                                <td width=\"120\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\"> R$ " . number_format($_subtotal, 2, ",", ".") . "</td>
		                              </tr>
		                              <tr>
		                                <td width=\"350\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" cellpadding>&nbsp;</td>
		                                <td width=\"50\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\">Frete</td>
		                                <td width=\"120\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\"> R$ ". number_format($_valorFrete, 2, ",", ".") . "</td>
		                              </tr>
		                              <tr>
		                                <td width=\"350\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" cellpadding>&nbsp;</td>
		                                <td width=\"50\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\">Total</td>
		                                <td width=\"120\" bgcolor=\"#ffffff\" style=\"font-size: 12px\" align=\"right\"> R$ ". number_format($_valorTotal, 2, ",", ".") . "</td>
		                              </tr>
			                        </tbody>
			                      </table>
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
		                                
		                                	$_html .= $_entregaNome . "<br>";
											$_html .= $_entregaEndereco;
											$_html .= $_entregaNumero!=""?", " . $_entregaNumero:"";
											$_html .= $_entregaComplemento!=""?" - " . $_entregaComplemento:"";
											$_html .= "<br>";
											$_html .= $_entregaBairro . " - " . $_entregaCidade . " - " . $_entregaUf;
											$_html .= "<br>";
											$_html .= $_entregaCep;
											$_html .= "<br>";
											//$_html .= $_entregaInformacoesReferencia;
										
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
		                                  " . TELEFONE . "<br>
		                                  <img width=\"17\" height=\"17\" src=\"" . URL_SSL .  "imagens/email-whatsapp.png\" valign=\"middle\" alt=\"WhatsApp\"> " . CELULAR . "<br>
		                                  plander@plander.com.br
		                                </td>
		                                <td width=\"200\">
		                                  <br>
		                                  <a href=\"" . URL . "faleConosco.php\" title=\"Entrar em contato com a Plander\"><img src=\"" . URL_SSL .  "imagens/email-botao-fale-conosco.png\" alt=\"Fale Conosco\" border=\"0\" width=\"191\" height=\"40\"></a>
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
		
		if (@$_GET["email"]=="1"){
			if (sendEmail($_pedidoEmail, "Compra " . $_pedidoCodigo . "!", $_html) == 0){
				if (isset($_GET["andamento"]) == null){
					//VEIO DO SITE
					echo "<script> alert('Ops, houve um erro no envio do email.'); </script>";
					echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
				}else{
					//VEIO DO ERP
					echo "Houve um erro no envio do email.\n";
				}

				die();
			}

			if (isset($_GET["andamento"]) == null)
				echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
			else 
				echo "Email de acompanhamento do pedido enviado em: " . date("d/m/Y G:i:s") . "\n";
			
			/*$mail = new PHPMailer(); // Cria a inst�ncia
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

			$mail->AddAddress($_pedidoEmail, $_pedidoNome); // Email e Nome do destinat�rio
			
			// Estes campos a seguir s�o opcionais, caso n�o queira usar, remova-os
			//$mail->AddReplyTo("email@dominio.com.br","Information"); // E-mail de Resposta
			//if(basename(getcwd()) == "public_html")
				//$mail->AddCC("plander@plander.com.br","Plander"); // Envia C�pia
			//else
				$mail->AddCC("suporte@iboltsys.com.br","Suporte iBolt");
			//$mail->AddBCC("suporte@iboltsys.com","Plander"); // Envia C�pia Oculta
			
			// Se voc� quiser anexar aquivos, pode utilizar os comandos abaixo, caso n�o v� enviar anexos, remova os comandos
			// $mail->AddAttachment("pdf/".$_arquivoNome); // Arquivo Anexo 1
			//$mail->AddAttachment("/tmp/image.jpg","new.jpg"); // Arquivo Anexo 2
			
			// Configura��o de Assuntos e Corpo do E-mail
			$mail->Subject = "Compra " . $_pedidoCodigo . "!"; // Define o Assunto
			$mail->Body = $_html; // Corpo da mensagem em formato HTML
			//$mail->Body = "teste";
			// Este campo abaixo � Opcional
			//$mail->AltBody = "Corpo da Mensagem somente Texto, sem formata��es"; // Voc� pode mandar um e-mail somente texto, caso o leitor de e-mails da pessoa n�o leia no formato HTML
			
			if($mail->Send()==false){
				if (isset($_GET["andamento"]) == null){
					//VEIO DO SITE
					echo "<script> alert('Houve um erro no envio do email.'); </script>";
					//print_r($mail->ErrorInfo);
					echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
				}else{
					//VEIO DO ERP
					echo "Houve um erro no envio do email.\n";
				}

				die();
			}
			
			if (isset($_GET["andamento"]) == null)
				echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
			else 
				echo "Email de acompanhamento do pedido enviado em: " . date("d/m/Y G:i:s") . "\n";*/
		}else
			echo $_html;
	}else{
		echo "<script> alert('Houve um erro no envio do email. (Codigo null)'); </script>";
	}
?>