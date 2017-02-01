<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8">
<?php
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("funcoes.php");
	
	verificaSSL(true);
	
	//EDITA CLIENTE
	if (@$_GET["tabela"]==TB_CLIENTE and @$_GET["acao"]=="editar") {
	
		if (@$_GET["pessoa"]=="0") {
			$_nomeEntrega = @$_POST["nome"];
		} else {
			$_nomeEntrega = @$_POST["rs"];
		}
		$cep = @$_POST["cep1"]."-".@$_POST["cep2"];
		
		if($_SESSION["Flag"] != "on") {
	
			if($_SESSION["PEDIDO"]["id"] != ""){
				$_pedido = $_conexao->getRecordById('PedidoWeb', $_SESSION["PEDIDO"]["id"]);
				
				$_pedido->setField('EntregaNome', $_nomeEntrega); 
				$_pedido->setField('EntregaRua', @$_POST["endereco"]);
				$_pedido->setField('EntregaNumero', @$_POST["numero"]);
				$_pedido->setField('EntregaComplemento',  @$_POST["complemento"]);
				$_pedido->setField('EntregaBairro', @$_POST["bairro"]);
				$_pedido->setField('EntregaMunicipio', @$_POST["cidade"]);
				$_pedido->setField('EntregaUf', @$_POST["uf"]);
				$_pedido->setField('EntregaCep', $cep);
				$_pedido->commit();
				
				$_SESSION["ENTREGA"]["nome"] = $_nomeEntrega;
				$_SESSION["ENTREGA"]["endereco"] = @$_POST["endereco"];
				$_SESSION["ENTREGA"]["numero"] = @$_POST["numero"];
				$_SESSION["ENTREGA"]["complemento"] = @$_POST["complemento"];
				$_SESSION["ENTREGA"]["bairro"] = @$_POST["bairro"];
				$_SESSION["ENTREGA"]["cidade"] = @$_POST["cidade"];
				$_SESSION["ENTREGA"]["uf"] = @$_POST["uf"];
				$_SESSION["ENTREGA"]["cep"] = $cep;
				
			}else{
				unset($_SESSION['PEDIDO']);
				unset($_SESSION["ENTREGA"]);
				unset($_SESSION["email"]);
				unset ($_SESSION["nome_razao"]);
				if ($_SESSION["Flag"]) {
					unset($_SESSION["Flag"]);
				}
				if ($_SESSION["CADASTRADO"]["id"]) {
					unset($_SESSION["CADASTRADO"]["id"]);
					unset ($_SESSION["CADASTRADO"]["codigo"]);
				}
				?>
				<script>
					alert('Ocorreu um erro na atualização do cadastro. Iremos redirecioná-lo ao carrinho.');
					parent.window.location.href = "../carrinho.php";
				</script>
				<?php
			}
		}
		
		if (@$_GET["cadastrado"]=="sim") {
	
			if($_SESSION["CADASTRADO"]["id"] != ""){
				$_cliente = $_conexao->getRecordById('ClienteWeb', $_SESSION["CADASTRADO"]["id"]);
				
				if ($_cliente->getField("Pessoa")=="0") {
					$_cliente->setField("Nome", @$_POST["nome"]);
					$_cliente->setField("Rg", @$_POST["rg"]);
					$_cliente->setField("DataNascimento", @$_POST["nascimento"]);
				} else {
					$_cliente->setField("RazaoSocial", @$_POST["rs"]);
					$_cliente->setField("InscricaoEstadual", @$_POST["ie"]);
				}
				
				$ddd = preg_replace("/[^0-9]/", "", @$_POST["ddd"]);
				$telefone = preg_replace("/[^0-9]/", "", @$_POST["telefone"]);
				if (@$_POST["telefone2"]) {
					$ddd2 = preg_replace("/[^0-9]/", "", @$_POST["ddd2"]);
					$telefone2 = preg_replace("/[^0-9]/", "", @$_POST["telefone2"]);
				}
					
				$_cliente->setField("Ddd", $ddd,0);
				$_cliente->setField("Telefone", $telefone,0);
				$_cliente->setField("Ddd", $ddd2,1);
				$_cliente->setField("Telefone", $telefone2,1);
				$_cliente->setField("Cep",  $cep);
				$_cliente->setField("Numero", @$_POST["numero"]);
				$_cliente->setField("Municipio", @$_POST["cidade"]);
				$_cliente->setField("Complemento", @$_POST["complemento"]);
				$_cliente->setField("Uf", @$_POST["uf"]);
				$_cliente->setField("Logradouro", @$_POST["endereco"]);
				$_cliente->setField("Bairro", @$_POST["bairro"]);
				$_cliente->setField("InformacoesReferencia", @$_POST["inrefe"]);
				$_cliente->setField("Senha", @$_POST["senha"]);
				$_cliente->commit();
		
				echo "<script> parent.window.location.href='../cadastroEditar.php?acao=2'; </script>";
			
			}else{
				unset($_SESSION['PEDIDO']);
				unset($_SESSION["ENTREGA"]);
				unset($_SESSION["email"]);
				unset ($_SESSION["nome_razao"]);
				if ($_SESSION["Flag"]) {
					unset($_SESSION["Flag"]);
				}
				if ($_SESSION["CADASTRADO"]["id"]) {
					unset($_SESSION["CADASTRADO"]["id"]);
					unset ($_SESSION["CADASTRADO"]["codigo"]);
				}
				?>
				<script>
					alert('Ocorreu um erro na atualização do cadastro. Iremos redirecioná-lo ao carrinho.');
					parent.window.location.href = "../carrinho.php";
				</script>
				<?php
			}
			
		} else {
			
			if ($_pedido==NULL) {
	
				if($_SESSION["PEDIDO"]["id"] != ""){
					
					$_pedido = $_conexao->getRecordById('PedidoWeb', $_SESSION["PEDIDO"]["id"]);
					
				}else{
					unset($_SESSION['PEDIDO']);
					unset($_SESSION["ENTREGA"]);
					unset($_SESSION["email"]);
					unset ($_SESSION["nome_razao"]);
					if ($_SESSION["Flag"]) {
						unset($_SESSION["Flag"]);
					}
					if ($_SESSION["CADASTRADO"]["id"]) {
						unset($_SESSION["CADASTRADO"]["id"]);
						unset ($_SESSION["CADASTRADO"]["codigo"]);
					}
					?>
					<script>
						alert('Ocorreu um erro na atualização do cadastro. Iremos redirecioná-lo ao carrinho.');
						parent.window.location.href = "../carrinho.php";
					</script>
					<?php
				}
			}
			
			if (@$_GET["pessoa"]=="0") {
				$_pedido->setField('ClienteNome', @$_POST["nome"]);
				$_pedido->setField('ClienteRg', @$_POST["rg"]);
				$_pedido->setField('ClienteDataNascimento', @$_POST["nascimento"]);
			} else {
				$_pedido->setField('ClienteRazaoSocial', @$_POST["rs"]);
				$_pedido->setField('ClienteInscricaoEstadual', @$_POST["ie"]);
			}
			
			$ddd = preg_replace("/[^0-9]/", "", @$_POST["ddd"]);
			$telefone = preg_replace("/[^0-9]/", "", @$_POST["telefone"]);
			if (@$_POST["telefone2"]) {
				$ddd2 = preg_replace("/[^0-9]/", "", @$_POST["ddd2"]);
				$telefone2 = preg_replace("/[^0-9]/", "", @$_POST["telefone2"]);
			}
			
			$_pedido->setField('ClienteDdd', $ddd, 0);
			$_pedido->setField('ClienteTelefone', $telefone, 0);
			$_pedido->setField('ClienteDdd', $ddd2, 1);
			$_pedido->setField('ClienteTelefone', $telefone2, 1);
			$_pedido->setField('ClienteRua', @$_POST["endereco"]);
			$_pedido->setField('ClienteNumero', @$_POST["numero"]);
			$_pedido->setField('ClienteComplemento', @$_POST["complemento"]);
			$_pedido->setField('ClienteBairro', @$_POST["bairro"]);
			$_pedido->setField('ClienteMunicipio', @$_POST["cidade"]);
			$_pedido->setField('ClienteUf', @$_POST["uf"]);
			$_pedido->setField('ClienteCep', $cep);
			$_pedido->setField('ClienteInformacoesReferencia', @$_POST["inrefe"]);
			$_pedido->setField('ClienteSenha', @$_POST["senha"]);
			$_pedido->commit();
			
			echo "<script> parent.window.location.href='../cadastroEditar.php?acao=2'; </script>";
		}
	}
?>