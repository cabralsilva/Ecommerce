<?php
	session_start();

	echo "<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\">";
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("funcoes.php");
	require_once("../actions/funcoesWS.php");
	
	verificaSSL(true);
	
	//CRIA PEDIDO COM CLIENTE NOVO
	
	if (@$_GET["tabela"]==TB_CLIENTE){
		$_acao = @$_GET["acao"];
		
		if(count($_SESSION["CART"])==0) {
			echo "<script> alert('Carrinho vazio.'); </script>";
			echo "<script> parent.window.location.href='../produtos.php'; </script>";
		}
		
		//*********************************************************************
		if ($_acao=="novo"){
			//Cria o pedido
			$_pedido = array(
				'Loja' => "Virtual",
				'Processo' => "Carrinho abandonado",
				'Editar' => "0"
			 );



		}else if ($_acao=="editar"){
			//Busca o pedido existente
			$_pedido = array(
				'codigoPedido' => $_SESSION["PEDIDO"]["codigo"]
			);
		}else
			die("<script> window.location.href='../carrinhoLogin.php'; </script>");
		
		//******************************************************************************************************************
		//cria variáveis em branco para não pegar dados do POST sem querer, por ex pegar campo IE e vier setado como física
		
		$_nomeEntrega = "";
		
		$_pessoa = "";
		$_nome = "";
		$_dataNascimento = "";
		$_cpf = "";
		$_rg = "";
		
		$_razaoSocial = "";
		$_cnpj = "";
		$_ie = "";
		
		$_email = "";
		
		$_ddd1 = "";
		$_telefone1 = "";
		$_ddd2 = "";
		$_telefone2 = "";
		
		$_cep1 = "";
		$_cep2 = "";
		$_endereco = "";
		$_numero = "";
		$_complemento = "";
		$_bairro = "";
		$_uf = "";
		$_cidade = "";
		
		$_informacoesReferencia = "";
		
		//******************************************************************************************************************
		$_pessoa = @$_POST["pessoa"]!=""?@$_POST["pessoa"]:"fisica";
		
		if ($_pessoa=="fisica"){
			$_nomeEntrega = @$_POST["nome-completo"];
			$_email = @$_POST["email-fisica"];
			
			$_nome = @$_POST["nome-completo"];
			$_dataNascimento = @$_POST["data-nascimento"];
			$_cpf = @$_POST["cpf"];
			$_rg = @$_POST["rg"];
			
			//*************************************************************
			
			$_ddd1 = preg_replace("/[^0-9]/", "", @$_POST["ddd-fisica"]);
			$_telefone1 = preg_replace("/[^0-9]/", "", @$_POST["telefone-fisica"]);
			
			if (@$_POST["telefone2-fisica"]) {
				$_ddd2 = preg_replace("/[^0-9]/", "", @$_POST["ddd2-fisica"]);
				$_telefone2 = preg_replace("/[^0-9]/", "", @$_POST["telefone2-fisica"]);
			}
		}else{
			$_nomeEntrega = @$_POST["razao-social"];
			$_email = @$_POST["email-juridica"];
			
			$_razaoSocial = @$_POST["razao-social"];
			$_cnpj = @$_POST["cnpj"];
			$_ie = @$_POST["ie"];
			
			//*************************************************************
			
			$_ddd1 = preg_replace("/[^0-9]/", "", @$_POST["ddd-juridica"]);
			$_telefone1 = preg_replace("/[^0-9]/", "", @$_POST["telefone-juridica"]);
			if (@$_POST["telefone2-juridica"]) {
				$_ddd2 = preg_replace("/[^0-9]/", "", @$_POST["ddd2-juridica"]);
				$_telefone2 = preg_replace("/[^0-9]/", "", @$_POST["telefone2-juridica"]);
			}
			
		}
		
		$_cep1 = @$_POST["cep1"];
		$_cep2 = @$_POST["cep2"];
		$_endereco = @$_POST["endereco"];
		$_numero = @$_POST["endereco-numero"];
		$_complemento = @$_POST["complemento"];
		$_bairro = @$_POST["bairro"];
		$_uf = @$_POST["estado"];
		$_cidade = @$_POST["cidade"];
		$_informacoesReferencia = @$_POST["pontos"];
		$_senha = @$_POST["senha"];
		
		//*********************************************************************
		//Alimenta na sessão os dados do usuário
		
		if (@$_SESSION["PEDIDO"]=="")
			@$_SESSION["PEDIDO"] = array();
		
		if (@$_SESSION["PEDIDO"]["USUARIO"]==""){
			$_SESSION["PEDIDO"]["USUARIO"] = "NOVO";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] = array();
		}
		
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] = $_pessoa;
		
		if ($_pessoa=="fisica"){
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = $_nome;
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = $_dataNascimento;
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = date("d/m/Y", strtotime($_dataNascimento));
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = $_cpf;
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = $_rg;
		}else{
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"] = "";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"] = "";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"] = "";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"] = "";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"] = "";
		}
		
		if ($_pessoa=="juridica"){
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = $_razaoSocial;
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = $_cnpj;
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = $_ie;
		}else{
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"] = "";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"] = "";
			$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"] = "";
		}
		
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"] = $_pessoa=="fisica"?$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"]:$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"];
		
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"] = $_email;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"] = $_ddd1;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"] = $_telefone1;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"] = $_ddd2;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"] = $_telefone2;
		
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"] = $_cep1;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"] = $_cep2;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"] = $_cep1 . $_cep2;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"] = $_cep1 . "-" . $_cep2;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"] = $_endereco;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"] = $_numero;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"] = $_complemento;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"] = $_bairro;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"] = $_cidade;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"] = $_uf;
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"] = $_informacoesReferencia;
		
		$_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["senha"] = $_senha;
		
		//*********************************************************************
		//Grava os dados no banco
		
		if ($_SESSION["PEDIDO"]["USUARIO"]=="NOVO"){

			$_pedido['ClientePessoa'] = ucfirst($_pessoa);
			
			if ($_pessoa=="fisica"){

				$_pedido['ClienteNome'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"];
				$_pedido['ClienteDataNascimento'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento_formatada"];
				$_pedido['ClienteCpf'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"];
				$_pedido['ClienteRg'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"];


			}else if ($_pessoa=="juridica"){

				$_pedido['ClienteRazaoSocial'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"];
				$_pedido['ClienteCnpj'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"];
				$_pedido['ClienteInscricaoEstadual'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"];
			}
			
			$_pedido['ClienteEmail'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"];

			$_pedido['ClienteCep'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"];
			$_pedido['ClienteRua'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"];
			$_pedido['ClienteNumero'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"];
			$_pedido['ClienteComplemento'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"];
			$_pedido['ClienteBairro'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"];
			$_pedido['ClienteMunicipio'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"];
			$_pedido['ClienteUf'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"];
			$_pedido['ClienteInformacoesReferencia'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"];

			$_pedido['ClienteDdd1'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"];
			$_pedido['ClienteTelefone1'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"];
			$_pedido['ClienteDdd2'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"];
			$_pedido['ClienteTelefone2'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"];

			$_pedido['ClienteSenha'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["senha"];

			$json_pedido = json_encode($_pedido);


			$resposta = null;
				
			if (isset($_SESSION["PEDIDO"]['codigo'])) {
				$_pedido['codigoPedido'] = $_SESSION["PEDIDO"]['codigo'];
				if (@$_POST["alterar_entrega"]=="1"){

					$_SESSION["ENTREGA"]["nome"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"];
					
					$_SESSION["ENTREGA"]["cep1"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"];
					$_SESSION["ENTREGA"]["cep2"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"];
					$_SESSION["ENTREGA"]["cep_completo"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"];
					$_SESSION["ENTREGA"]["cep_completo_formatado"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"];
					$_SESSION["ENTREGA"]["endereco"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"];
					$_SESSION["ENTREGA"]["numero"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"];
					$_SESSION["ENTREGA"]["complemento"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"];
					$_SESSION["ENTREGA"]["bairro"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"];
					$_SESSION["ENTREGA"]["uf"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"];
					$_SESSION["ENTREGA"]["cidade"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"];
					$_SESSION["ENTREGA"]["informacoes_referencia"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"];
					
					$_pedido['EntregaNome'] = $_SESSION["ENTREGA"]["nome"];
					$_pedido['EntregaCep'] = $_SESSION["ENTREGA"]["cep_completo_formatado"];
					$_pedido['EntregaRua'] = $_SESSION["ENTREGA"]["endereco"];
					$_pedido['EntregaNumero'] = $_SESSION["ENTREGA"]["numero"];
					$_pedido['EntregaComplemento'] = $_SESSION["ENTREGA"]["complemento"];
					$_pedido['EntregaBairro'] = $_SESSION["ENTREGA"]["bairro"];
					$_pedido['EntregaUf'] = $_SESSION["ENTREGA"]["uf"];
					$_pedido['EntregaMunicipio'] = $_SESSION["ENTREGA"]["cidade"];
					
					$json_pedido = json_encode($_pedido);
				}



				$resposta = sendWsJson($json_pedido, UrlWs . "atualizarClienteNovo");


			}else {
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

	    		$_pedido['lstItems'] = $items;

	    		$objJson = json_encode($_pedido);    		
	    		$return = sendWsJson($objJson, UrlWs . "novocliente");
	    		$_pedido['codigoPedido'] = $return->model->codigoPedido;

	    		$_SESSION["ENTREGA"]["nome"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"];
					
				$_SESSION["ENTREGA"]["cep1"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"];
				$_SESSION["ENTREGA"]["cep2"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"];
				$_SESSION["ENTREGA"]["cep_completo"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"];
				$_SESSION["ENTREGA"]["cep_completo_formatado"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"];
				$_SESSION["ENTREGA"]["endereco"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"];
				$_SESSION["ENTREGA"]["numero"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"];
				$_SESSION["ENTREGA"]["complemento"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"];
				$_SESSION["ENTREGA"]["bairro"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"];
				$_SESSION["ENTREGA"]["uf"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"];
				$_SESSION["ENTREGA"]["cidade"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"];
				$_SESSION["ENTREGA"]["informacoes_referencia"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"];

			}
  				
			

		}else if ($_SESSION["PEDIDO"]["USUARIO"]=="CADASTRADO"){
			echo "Atualizando cadastro CLIENTE <BR/>";
			$_cliente = array(
				'codigoCliente' => $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["codigo"] 
			);
			
			if ($_pessoa=="fisica"){

				$_cliente['Nome'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome"];
				$_cliente['DataNascimento'] = date("Y-m-d", strtotime($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["data_nascimento"]));
				$_cliente['Cpf'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cpf"];
				$_cliente['Rg'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["rg"];
			}else if ($_pessoa=="juridica"){

				$_cliente['RazaoSocial'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"];
				$_cliente['Cnpj'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"];
				$_cliente['InscricaoEstadual'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"];
			}
			

			$_cliente['Email'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"];

			$_cliente['Cep'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"];
			$_cliente['Logradouro'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"];
			$_cliente['Numero'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"];
			$_cliente['Complemento'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"];
			$_cliente['Bairro'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"];
			$_cliente['Municipio'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"];
			$_cliente['Uf'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"];
			$_cliente['InformacoesReferencia'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"];

			$_cliente['Ddd1'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"];
			$_cliente['Telefone1'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"];
			$_cliente['Ddd2'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"];
			$_cliente['Telefone2'] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"];

			

			$_pedido['codigoPedido'] = $_SESSION["PEDIDO"]['codigo'];
			if (@$_POST["alterar_entrega"]=="1"){
				$_SESSION["ENTREGA"]["nome"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"];
				$_SESSION["ENTREGA"]["cep1"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"];
				$_SESSION["ENTREGA"]["cep2"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"];
				$_SESSION["ENTREGA"]["cep_completo"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo"];
				$_SESSION["ENTREGA"]["cep_completo_formatado"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep_completo_formatado"];
				$_SESSION["ENTREGA"]["endereco"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"];
				$_SESSION["ENTREGA"]["numero"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"];
				$_SESSION["ENTREGA"]["complemento"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"];
				$_SESSION["ENTREGA"]["bairro"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"];
				$_SESSION["ENTREGA"]["uf"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"];
				$_SESSION["ENTREGA"]["cidade"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"];
				$_SESSION["ENTREGA"]["informacoes_referencia"] = $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"];
				
				$_pedido['EntregaNome'] = $_SESSION["ENTREGA"]["nome"];
				$_pedido['EntregaCep'] = $_SESSION["ENTREGA"]["cep_completo_formatado"];
				$_pedido['EntregaRua'] = $_SESSION["ENTREGA"]["endereco"];
				$_pedido['EntregaNumero'] = $_SESSION["ENTREGA"]["numero"];
				$_pedido['EntregaComplemento'] = $_SESSION["ENTREGA"]["complemento"];
				$_pedido['EntregaBairro'] = $_SESSION["ENTREGA"]["bairro"];
				$_pedido['EntregaUf'] = $_SESSION["ENTREGA"]["uf"];
				$_pedido['EntregaMunicipio'] = $_SESSION["ENTREGA"]["cidade"];
				
				$_pedido['fkCliente'] = $_cliente;
				$json_pedido = json_encode($_pedido);
				$resposta = sendWsJson($json_pedido, UrlWs . "atualizarClienteEnderecoEntrega");
			}else {
				$json_cliente = json_encode($_cliente);
				$resposta = sendWsJson($json_cliente, UrlWs . "atualizarCliente");	
			}
			
  			

		}
		
		if ($_acao=="novo"){
			$_SESSION["PEDIDO"]["codigo"] = $_pedido['codigoPedido'];
			
			@$_SESSION["email"] = $_email;
			$_SESSION["PEDIDO"]["email"] = @$_SESSION["email"];
		}
		
		die("<script> parent.window.location.href='../carrinhoPagamento'; </script>");
	}	
?>