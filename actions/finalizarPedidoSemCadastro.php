<?php
	@session_start();
	
	echo "<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\">";

	@require_once("../class/constantes.php");
	@require_once("../class/filemaker.class.php");
	@require_once("funcoes.php");
	require_once("../actions/funcoesWS.php");
	require_once("../class/PHPMailer-master/class.phpmailer.php");
	
	verificaSSL(true);
	
	error_reporting(0);
	ini_set("display_errors", 0);
	if ($_POST ["pessoa"] == "fisica") {
		if (validaCPF ( $_POST ["cpf"] ) != 1) {
			echo "<script> alert('Ops, CPF inválido!'); </script>";
			echo "<script> parent.window.location.href='../carrinhoPagamentoSemCadastro'; </script>";
			die ();
		}
		$_POST ["cpf"] = str_replace ( ".", "", $_POST ["cpf"] );
		$_POST ["cpf"] = str_replace ( "-", "", $_POST ["cpf"] );
	} else {
		if (isCnpjValid ( @$_POST ["cnpj"] ) != 1) {
			echo "<script> alert('Ops, CNPJ inválido!'); </script>";
			echo "<script> parent.window.location.href='../carrinhoPagamentoSemCadastro'; </script>";
			die ();
		}
		$_POST ["cnpj"] = str_replace ( ".", "", $_POST ["cnpj"] );
		$_POST ["cnpj"] = str_replace ( "-", "", $_POST ["cnpj"] );
		$_POST ["cnpj"] = str_replace ( "/", "", $_POST ["cnpj"] );
	}
	
		
	if ($_POST["pagamento"] != ""){

			$_pedido = array();
			//******************************************************************************************************************
			$_pedido['usr'] = 'pdroqtl';
			$_pedido['pwd'] = 'jck9com*';
			//******************************************************************************************************************
			
			$_pedido['Loja'] = "Virtual";
			$_pedido['Editar'] = "0";
			$_pedido['ClientePessoa'] = ucfirst ( $_POST ["pessoa"] );
			if ($_POST ["pessoa"] == "fisica") {
					
				$_pedido ['ClienteNome'] = $_POST["nome-completo"];
				$_pedido ['ClienteCpf'] = $_POST["cpf"];
				$_pedido ['ClienteRg'] = $_POST["rg"];
			} else if ($_POST ["pessoa"] == "juridica") {
					
				$_pedido ['ClienteRazaoSocial'] = $_POST["razao-social"];
				$_pedido ['ClienteCnpj'] = $_POST["cnpj"];
				$_pedido ['ClienteInscricaoEstadual'] = $_POST["ie"];
			}
			
			$_pedido['ClienteEmail'] = $_POST["email"];
			$_pedido['ClienteCep'] = $_POST["cep"];
			$_pedido['ClienteRua'] = $_POST["endereco"];
			$_pedido['ClienteNumero'] = $_POST["endereco-numero"];
			$_pedido['ClienteComplemento'] = $_POST["complemento"];
			$_pedido['ClienteBairro'] = $_POST["bairro"];
			$_pedido['ClienteMunicipio'] = $_POST["cidade"];
			
			$_pedido['ClienteUf'] = $_POST["estado"];
			$_pedido['ClienteInformacoesReferencia'] = $_POST["pontos"];
			$_pedido['ClienteDdd1'] = $_POST["ddd1"];
			$_pedido['ClienteTelefone1'] = $_POST["telefone1"];
			$_pedido['ClienteDdd2'] = $_POST["ddd2"];
			$_pedido['ClienteTelefone2'] = $_POST["telefone2"];
			
			//INSERE ENDEREÇO DE ENTREGA
						
			$_pedido['EntregaNome'] = $_POST["nome-completo"]; 
			$_pedido['EntregaRua'] = $_POST["endereco"];
			$_pedido['EntregaNumero'] = $_POST["endereco-numero"];
			$_pedido['EntregaComplemento'] = $_POST["complemento"];
			$_pedido['EntregaBairro'] = $_POST["bairro"];
			$_pedido['EntregaMunicipio'] = $_POST["cidade"];
			$_pedido['EntregaInformacoesReferencia'] = $_POST["pontos"];
			$_pedido['EntregaUf'] = $_POST["estado"];
			$_pedido['EntregaCep'] = $_POST["cep"];
			$_pedido['Processo'] = "";
			
			
			$_pedido['TransacaoIp'] = $_SERVER["REMOTE_ADDR"];		
			
			//INSERE ITEMS
			$_chaves = array_keys ( $_SESSION ["CART"] );
			$items = array ();
			for($_i = 0; $_i < count ( $_chaves ); $_i ++) {
				$item = array (
						'codigo_produto_grade' => $_SESSION ["CART"] [$_chaves [$_i]] ["codigo_produto_grade"],
						'quantidade' => $_SESSION ["CART"] [$_chaves [$_i]] ["quantidade"],
						'valor' => $_SESSION ["CART"] [$_chaves [$_i]] ["valor"],
						'descricao' => $_SESSION ["CART"] [$_chaves [$_i]] ["descricao"]
				);
				array_push ( $items, $item );
			}
				
			$_pedido ['lstItems'] = $items;
			
			$objJson = json_encode ( $_pedido );
			$return = sendWsJson ( $objJson, UrlWs . "novocliente" );
			if ($return->codStatus != 1) {
				if ($return != null) {
					$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $return->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date ( 'd/M/y G:i:s' ) . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . $_SERVER ['HTTP_REFERER'] . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER ['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER ['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER ["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser () . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname () . "<br><br>";
					sendEmailLog ( $_conteudo );
					echo "<script> alert('Ops, houve um erro na comunicação com o banco de dados(NC). Tente novamente!'); </script>";
				}
				echo "<script> parent.window.location.href='../carrinhoPagamentoSemCadastro'; </script>";
				die ();
			}
			$_pedido ['codigoPedido'] = $return->model->codigoPedido;
			
			//******************************************************************************************************************
			//INSERE FORMA PAGAMENTO E FRETE
			if ($_POST["pagamento"]=="0")
				$_pedido['FormaPagamento'] = "Visa";
			elseif ($_POST["pagamento"]=="1")
				$_pedido['FormaPagamento'] = "Mastercard";
			elseif ($_POST["pagamento"]=="2")
				$_pedido['FormaPagamento'] = "Boleto";
						
			
			if ($_POST["entrega"]=="0")
				$_pedido['TipoFrete'] = "Pac";
			else if ($_POST["entrega"]=="1")
				$_pedido['TipoFrete'] = "Sedex";
			else if ($_POST["entrega"]=="2")
				$_pedido['TipoFrete'] = "Transportadora";
			else if ($_POST["entrega"]=="3")
				$_pedido['TipoFrete'] = "Retirada na loja";
			
			
			$_pedido['ValorFrete'] = $_SESSION["PEDIDO"]["valor_frete"];
			
			//******************************************************************************************************************
			//BOLETO
			if ($_pedido['FormaPagamento'] == "Boleto"){
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
				//CARTÃO
				$_numeroParcelas = $_POST["parcelamento"];
				$_numeroParcelas = $_numeroParcelas==""||$_numeroParcelas==null?1:$_numeroParcelas;
				
				$_temJuros = $_numeroParcelas>$_SESSION["PEDIDO"]["quantidade_parcelas_sem_juros"];
				
				if($_temJuros)
					$_valorParcela = number_format(pmt(JUROS,$_numeroParcelas,$_SESSION["PEDIDO"]["valor_total"]),2,".","");
				else
					$_valorParcela = number_format($_SESSION["PEDIDO"]["valor_total"] / $_numeroParcelas,2,".","");
				
				$_valorTotalComJuros = $_valorParcela*$_numeroParcelas;
				$_valorJuros = $_valorTotalComJuros-$_SESSION["PEDIDO"]["valor_total"];
				
				$_data = date("Y-m-d", strtotime("now"));
				
				$_pedido['NumeroParcelas'] = $_numeroParcelas;
				$_pedido['ValorParcelas'] = $_valorParcela;
				$_pedido['CartaoTitular'] = $_POST["nome-impresso"];
				$_pedido['CartaoNumero'] = $_POST["numero-cartao"];
				$_pedido['CartaoValidade'] = $_POST["mes-cartao"] . "/" . $_POST["ano-cartao"];
				$_pedido['CartaoCodigoSeguranca'] = $_POST["codigo-cartao"];
				
				if ($_temJuros)
					$_pedido['ValorOutros'] = $_valorJuros;
				
				//****************************************************************
				
				if($_pedido['FormaPagamento'] == "Visa"){
					if($_SESSION["parcela"] == 1){
						$_codigoFmFormaPagamento = 3;
					}else{
						$_codigoFmFormaPagamento = 5;
					}
				}else if($_pedido['FormaPagamento'] == "Mastercard"){
					if($_SESSION["parcela"] == 1){
						$_codigoFmFormaPagamento = 7;
					}else{
						$_codigoFmFormaPagamento = 8;
	
					}
				}else if($_pedido['FormaPagamento'] == "american"){
					if($_SESSION["parcela"] == 1){
						$_codigoFmFormaPagamento = 13;
					}else{
						$_codigoFmFormaPagamento = 14;
					}
				}
			}
			
			//******************************************************************************************************************		
			// INSERE FORMA DE PAGAMENTO
			$_pagamento = array(
				'CodigoPedido' => $_pedido['codigoPedido'],
				'CodigoFormaPagamento' => $_codigoFmFormaPagamento,
				'Parcelas' => $_numeroParcelas,
				'Valor' => $_valorTotalComJuros
			);
			$_pagamento['Data'] = ($_pedido['FormaPagamento'] == "Boleto" ? $_pedido["DataVencimento"] : $_data);
			$_pedido['fkPagamento'] = $_pagamento;

			
			
			$json_object = json_encode($_pedido);
			$resposta = sendWsJson($json_object, UrlWs . "updatePedidoFinalizacao");

			if ($resposta->codStatus != 1) {
				if($resposta != null){
					$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
					$_conteudo .= "<strong>Descrição: </strong>" . $resposta->msg . "<br><br>";
					$_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
					$_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
					$_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
					$_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
					$_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
					$_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
					$_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
					sendEmailLog($_conteudo);
					echo "<script> alert('Ops, houve uma falha ao finalizar o seu pedido. Tente novamente!'); </script>";
					
				}
				
				echo "<script> parent.window.location.href='../carrinhoPagamento'; </script>";
				die();
			} 
			
			if ($_pedido['FormaPagamento'] == "Boleto"){
				echo "<script> window.open(\"../boleto/boleto_bradesco.php?id=" . $_pedido['codigoPedido'] . "\",\"janelaBloq\", \"width=800, height=650, top=0, left=0, scrollbars=no, status=no, resizable=no, directories=no, location=no, menubar=no, titlebar=no, toolbar=no\"); </script>";
			}
			$_SESSION["PEDIDO"]["isNoRegister"] = 1;
			echo "<script> window.location.href = '../carrinhoConfirmacao.php'; </script>";
			die();
		}else{
			$_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
			$_conteudo .= "<strong>Descrição: </strong>Não foi possível identificar a forma de pagamento do pedido. <br><br>";
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
			
			
			echo "<script> alert('Ocorreu um erro na finalização do pedido. Iremos redirecioná-lo para o carrinho.'); </script>";
			echo "<script> window.location.href = '../carrinho'; </script>";	
		}
				

?>				
