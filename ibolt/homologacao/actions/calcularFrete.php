<?php
	function calcularFrete($_cep, $_peso, $_altura, $_largura, $_comprimento){
	
		//1 para pac 0.00
		define("PAC", 1);
	
		//valores mínimos
		if($_peso == "" or $_peso == 0)
			$_peso = 0.100;
		else
			$_peso = $_peso;
				
		if($_altura < 2)
			$_altura = 2;
		else
			$_altura= $_altura;
				
		if($_largura < 11)
			$_largura = 11;
		else
			$_largura = $_largura;
					
		if($_comprimento < 16)
			$_comprimento = 16;
		else
			$_comprimento = $_comprimento;
	
		$_data['nCdEmpresa'] = '10324801';
		$_data['sDsSenha'] = '12345678';
		$_data['sCepOrigem'] = '80230090';		
		$_data['sCepDestino'] = $_cep;
		$_data['nVlPeso'] = $_peso;
		$_data['nCdFormato'] = '1';
		$_data['nVlComprimento'] = round($_comprimento);
		$_data['nVlAltura'] = round($_altura);
		$_data['nVlLargura'] = round($_largura);
		$_data['nVlDiametro'] = '0';
		$_data['sCdMaoPropria'] = 'n';
		$_data['nVlValorDeclarado'] = 0;
		$_data['sCdAvisoRecebimento'] = 'n';
		$_data['StrRetorno'] = 'xml';
		$_data['nCdServico'] = '41106,40010';
		$_data = http_build_query($_data);
		
		$_url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx';
		$_curl = curl_init($_url . '?' . $_data);
		
		curl_setopt($_curl, CURLOPT_RETURNTRANSFER, true);
		$_result = curl_exec($_curl);
		$_result = simplexml_load_string($_result);
										
		if($_result[0] == 0){
			
			foreach($_result->cServico as $_row) {
							
				for ($_i=0; $_i<count($_row->Valor); $_i++){
					$_valor[] = $_row->Valor[$_i];
				}
				for ($_i=0; $_i<count($_row->PrazoEntrega); $_i++){
					$_prazo[] = $_row->PrazoEntrega[$_i];
				}
						
			}
			
			if(PAC == 1)
				$_frete[0] = '0.00';
			else
				$_frete[0] = str_replace(",", ".", $_valor[0]);
						
			$_frete[1] = str_replace(",", ".", $_valor[1]);
			$_frete[2] = $_prazo[0] + 2;
			$_frete[3] = $_prazo[1] + 2;
			
			return $_frete;
		}else{
			return "n";
		}
	}
	
	function calcularFreteVolume(){
		$_chaves = array_keys($_SESSION["CART"]);
				
		for($_i=0; $_i < count($_chaves); $_i++) {		
			$_peso += ($_SESSION["CART"][$_chaves[$_i]]["quantidade"] * $_SESSION["CART"][$_chaves[$_i]]["peso"]);			
			$_volume += ($_SESSION["CART"][$_chaves[$_i]]["altura"] * $_SESSION["CART"][$_chaves[$_i]]["largura"] * $_SESSION["CART"][$_chaves[$_i]]["comprimento"] * $_SESSION["CART"][$_chaves[$_i]]["quantidade"]);										 										
		}
 	
		$_raizCubica = round(pow($_volume,1/3),2);
		$_altura = $_raizCubica;
		$_largura = $_raizCubica;
		$_comprimento = $_raizCubica;	
			
		for ($_divisor = 1; $_peso > 30 or $_altura > 105 or $_largura > 105 or $_comprimento > 105 or ($_altura + $_largura + $_comprimento) > 200; ){
				
			$_divisor = $_divisor + 1;						
								
			$_peso = round(($_peso / $_divisor),2);
			$_volume = $_volume / $_divisor;
			$_raizCubica = round(pow($_volume,1/3));
			$_altura = $_raizCubica;
			$_largura = $_raizCubica;
			$_comprimento = $_raizCubica;
		}
		
		$_frete = calcularFrete($_cep, $_peso, $_altura, $_largura, $_comprimento);
		
		if($_frete!="n"){
			$_valorPac = str_replace('.',',',$_frete[0]);
			$_valorSedex = str_replace('.',',',$_frete[1]);
			$_prazoPac = str_replace('.',',',$_frete[2]);
			$_prazoSedex = str_replace('.',',',$_frete[3]);
			
			return $_array = array(
							"prazo_pac"=>$_prazoPac,
							"valor_pac"=>$_valorPac,
							"prazo_sedex"=>$_prazoSedex,
							"valor_sedex"=>$_valorSedex
							);
		}else
			return null;
	}
	
	if(@$_GET["tipo"]=="0"){
		$_frete = calcularFrete($_GET["cep"], $_GET["peso"], $_GET["altura"], $_GET["largura"], $_GET["comprimento"]);
		
		if($_frete!="n"){
			$_valorPac = str_replace('.',',',$_frete[0]);
			$_valorSedex = str_replace('.',',',$_frete[1]);
			$_prazoPac = str_replace('.',',',$_frete[2]);
			$_prazoSedex = str_replace('.',',',$_frete[3]);
			
			$_array = array(
							"prazo_pac"=>$_prazoPac,
							"valor_pac"=>$_valorPac,
							"prazo_sedex"=>$_prazoSedex,
							"valor_sedex"=>$_valorSedex
							);
			echo json_encode($_array);
		}else{
			echo json_encode($_GET["tipo"] . "-" . $_GET["cep"] . "-" . $_GET["peso"] . "-" . $_GET["altura"] . "-" . $_GET["largura"] . "-" . $_GET["comprimento"]);
		}
	}
	//	echo json_encode("n x-" . @$_GET["tipo"] . "-" . @$_GET["cep"] . "-" . @$_GET["peso"] . "-" . @$_GET["altura"] . "-" . @$_GET["largura"] . "-" . @$_GET["comprimento"]);
?>