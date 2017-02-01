<?php
	@session_start();
	
	echo "<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\">";

	@require_once("../class/constantes.php");
	@require_once("../class/filemaker.class.php");
	@require_once("funcoes.php");
	require_once("../actions/funcoesWS.php");
	
	verificaSSL(true);
	
	error_reporting(0);
	ini_set("display_errors", 0);
	
	@$_SESSION["PEDIDO"]["forma_pagamento"] = "";
	if (@$_POST["pagamento"]=="0")
		$_SESSION["PEDIDO"]["forma_pagamento"] = "visa";
	else if (@$_POST["pagamento"]=="1")
		$_SESSION["PEDIDO"]["forma_pagamento"] = "master";
	if (@$_POST["pagamento"]=="2")
		$_SESSION["PEDIDO"]["forma_pagamento"] = "boleto";
	
	if ($_SESSION["PEDIDO"]["forma_pagamento"]!=""){

		if($_SESSION["PEDIDO"]["codigo"] != ""){
			//******************************************************************************************************************
			//BUSCA O PEDIDO
			$_pedido = array();
			//******************************************************************************************************************
			$_pedido['codigoPedido'] = $_SESSION["PEDIDO"]["codigo"];
			//******************************************************************************************************************
			//INSERE ENDEREÇO DE ENTREGA
						
			$_pedido['EntregaNome'] = $_SESSION["ENTREGA"]["nome"]; 
			$_pedido['EntregaRua'] = $_SESSION["ENTREGA"]["endereco"];
			$_pedido['EntregaNumero'] = $_SESSION["ENTREGA"]["numero"];
			$_pedido['EntregaComplemento'] = $_SESSION["ENTREGA"]["complemento"];
			$_pedido['EntregaBairro'] = $_SESSION["ENTREGA"]["bairro"];
			$_pedido['EntregaMunicipio'] = $_SESSION["ENTREGA"]["cidade"];
			$_pedido['EntregaInformacoesReferencia'] = $_SESSION["ENTREGA"]["informacoes_referencia"];
			$_pedido['EntregaUf'] = $_SESSION["ENTREGA"]["uf"];
			$_pedido['EntregaCep'] = $_SESSION["ENTREGA"]["cep_completo_formatado"];
		
			$_pedido['Processo'] = "";
			
			//******************************************************************************************************************
			//INSERE FORMA PAGAMENTO E FRETE

			$_pedido['TransacaoIp'] = $_SERVER["REMOTE_ADDR"];
			
			$_pedido['FormaPagamento'] = $_forma;
			
			$_SESSION["PEDIDO"]["tipo_frete"] = $_POST["entrega"]; //0 pac, 1 sedex, 2 transp
			
			if ($_SESSION["PEDIDO"]["tipo_frete"]=="0")
				$_tipoFrete = "Pac";
			else if ($_SESSION["PEDIDO"]["tipo_frete"]=="1")
				$_tipoFrete = "Sedex";
			else if ($_SESSION["PEDIDO"]["tipo_frete"]=="2")
				$_tipoFrete = "Transportadora";
			else if ($_SESSION["PEDIDO"]["tipo_frete"]=="3")
				$_tipoFrete = "Retirada na loja";
			
			$_pedido['TipoFrete'] = $_tipoFrete;
			$_pedido['Loja'] = "Virtual";
			
			$_pedido['ValorFrete'] = $_SESSION["PEDIDO"]["valor_frete"];
			
			//******************************************************************************************************************
			//BOLETO
			
			$_pedido['FormaPagamento'] = $_SESSION["PEDIDO"]["forma_pagamento"];

			if ($_SESSION["PEDIDO"]["forma_pagamento"] == "boleto"){
				$_formaPagamento = "Boleto bancário";
				$_SESSION["PEDIDO"]["outros"] = 0.00;
				
				$_valorTotal = $_SESSION["PEDIDO"]["subtotal"] + $_SESSION["PEDIDO"]["valor_frete"];
				
				$dias_de_prazo_para_pagamento = 3;
				$_codigoFmFormaPagamento = 27;
				$_data = strtotime(date("y") . "-" . date("m") . "-" . date("d"));
				$_dataVencimento = strtotime("+" . 3 . " day", $_data);
				$_data = date("Y-m-d", $_dataVencimento);

				$_valorTotalComJuros = $_valorTotal;
				
				$_pedido['DataVencimento'] = date("Y-m-d", $_dataVencimento);

				$_numeroParcelas = 1;

				$_pedido['NumeroParcelas'] = $_numeroParcelas;
				$_pedido['ValorParcelas'] = $_valorTotal;
			}else{
				//******************************************************************************************************************		
				//CARTÃO
				$_SESSION["PEDIDO"]["mes"] = @$_POST["mes-cartao"];
				$_SESSION["PEDIDO"]["ano"] = @$_POST["ano-cartao"];
				$_SESSION["PEDIDO"]["numseg"] = @$_POST["codigo-cartao"];
				$_SESSION["PEDIDO"]["titular"] = @$_POST["nome-impresso"];
				$_SESSION["PEDIDO"]["num1"] = @$_POST["numero-cartao"];
				
				//****************************************************************
				
				$_numeroParcelas = @$_POST["parcelamento"];
				$_numeroParcelas = $_numeroParcelas==""||$_numeroParcelas==null?1:$_numeroParcelas;
				
				$_temJuros = $_numeroParcelas>$_SESSION["PEDIDO"]["quantidade_parcelas_sem_juros"];
				
				if($_temJuros)
					$_valorParcela = number_format(pmt(JUROS,$_numeroParcelas,$_SESSION["PEDIDO"]["valor_total"]),2,".","");
				else
					$_valorParcela = number_format($_SESSION["PEDIDO"]["valor_total"] / $_numeroParcelas,2,".","");
				
				$_valorTotalComJuros = $_valorParcela*$_numeroParcelas;
				$_valorJuros = $_valorTotalComJuros-$_SESSION["PEDIDO"]["valor_total"];
				
				//****************************************************************
				
				$_data = date("Y-m-d", strtotime("now"));
				
				$_SESSION["CARTAO_VALIDADE"] = $_SESSION["PEDIDO"]["mes"] . "/" . $_SESSION["PEDIDO"]["ano"];

				$_pedido['NumeroParcelas'] = $_numeroParcelas;
				$_pedido['ValorParcelas'] = $_valorParcela;
				$_pedido['CartaoTitular'] = $_SESSION["PEDIDO"]["titular"];
				$_pedido['CartaoNumero'] = $_SESSION["PEDIDO"]["num1"];
				$_pedido['CartaoValidade'] = $_SESSION["CARTAO_VALIDADE"];
				$_pedido['CartaoCodigoSeguranca'] = $_SESSION["PEDIDO"]["numseg"];
				
				if ($_temJuros)
					$_pedido['ValorOutros'] = $_valorJuros;
				
				//****************************************************************
				
				if($_SESSION["PEDIDO"]["forma_pagamento"] == "visa"){
					if($_SESSION["parcela"] == 1){
						$_codigoFmFormaPagamento = 3;
					}else{
						$_codigoFmFormaPagamento = 5;
					}
				}else if($_SESSION["PEDIDO"]["forma_pagamento"] == "master"){
					if($_SESSION["parcela"] == 1){
						$_codigoFmFormaPagamento = 7;
					}else{
						$_codigoFmFormaPagamento = 8;
	
					}
				}else if($_SESSION["PEDIDO"]["forma_pagamento"] == "american"){
					if($_SESSION["parcela"] == 1){
						$_codigoFmFormaPagamento = 13;
					}else{
						$_codigoFmFormaPagamento = 14;
					}
				}
			}
			
			//******************************************************************************************************************		
			// INSERE PORTAL FORMA DE PAGAMENTO
			$_pagamento = array(
				'CodigoPedido' => $_pedido['codigoPedido'],
				'CodigoFormaPagamento' => $_codigoFmFormaPagamento,
				'Parcelas' => $_numeroParcelas,
				'Valor' => $_valorTotalComJuros
			);
			$_pagamento['Data'] = ($_SESSION["PEDIDO"]["forma_pagamento"] == "boleto" ? $_pedido["DataVencimento"] : $_data);
			$_pedido['fkPagamento'] = $_pagamento;

			
			$json_object = json_encode($_pedido);
			$resposta = sendWsJson($json_object, UrlWs . "updatePedidoFinalizacao");

			if ($resposta->codStatus != 1) {
				echo "<script> alert('Falha ao finalizar o pedido. $resposta->msg'); </script>";
				echo "<script> parent.window.location.href='../carrinhoPagamento'; </script>";
				die();
			} 

			if ($_SESSION["PEDIDO"]["forma_pagamento"] == "boleto"){
				echo "<script> window.open(\"../boleto/boleto_bradesco.php?id=" . $_pedido['codigoPedido'] . "\",\"janelaBloq\", \"width=800, height=650, top=0, left=0, scrollbars=no, status=no, resizable=no, directories=no, location=no, menubar=no, titlebar=no, toolbar=no\"); </script>";
			}
			echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
		}else{
			unset($_SESSION['PEDIDO']);
			unset($_SESSION["ENTREGA"]);
			unset($_SESSION["email"]);
			
			?>
			<script>
				alert('Ocorreu um erro na finalização do pedido. Iremos redirecioná-lo para o carrinho.');
                parent.window.location.href = "../carrinho";
            </script>
            <?php
				
		}
				
	}else{
		?>
		<script>
			parent.window.location.href = "../index";
		</script>
		<?php
	}
?>				
