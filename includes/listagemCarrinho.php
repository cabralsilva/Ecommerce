<?php

	@session_start();
	
	require_once("../class/constantes.php");
	require_once("../class/filemaker.class.php");
	require_once("../actions/calcularFrete.php");
	require_once("../actions/funcoes.php");
	
	if (is_array(@$_SESSION["CART"])==false)
		$_SESSION["CART"] = array();
	
	if(@$_GET["acao"]=="inserir") {
		if (@$_SESSION["PEDIDO"]["USUARIO"]!="")
			@$_SESSION["PEDIDO"]["CARRINHO_ALTERADO"] = true;
			
		$_idProduto = @$_GET["id"];
		
		$_sqlProdutoGrade = "SELECT  PG.Id AS Id_ProdutoGrade";
		$_sqlProdutoGrade .= ", PG.CodigoProdutoGrade";
		$_sqlProdutoGrade .= ", PG.CodigoProduto";
		$_sqlProdutoGrade .= ", PG.Disponivel";
		$_sqlProdutoGrade .= ", PG.Modelo";
		$_sqlProdutoGrade .= ", P.Id AS Id_Produto";
		$_sqlProdutoGrade .= ", PG.Descricao";
		$_sqlProdutoGrade .= ", P.Promocao";
		$_sqlProdutoGrade .= ", P.QuantidadeParcelas";
		$_sqlProdutoGrade .= ", P.QuantidadeParcelasSemJuros";
		$_sqlProdutoGrade .= ", P.Transportadora";
		$_sqlProdutoGrade .= ", P.ValorSaida";
		$_sqlProdutoGrade .= ", P.ValorSaidaPromocao";
		$_sqlProdutoGrade .= ", P.PesoBruto";
		$_sqlProdutoGrade .= ", P.Altura";
		$_sqlProdutoGrade .= ", P.Largura";
		$_sqlProdutoGrade .= ", P.Comprimento";
		$_sqlProdutoGrade .= ", G.Codigo AS Codigo_Grupo";
		$_sqlProdutoGrade .= ", G.Departamento";
		$_sqlProdutoGrade .= " FROM Grupo AS G";
		$_sqlProdutoGrade .= " INNER JOIN Categoria AS C ON G.Codigo = C.CodigoGrupo";
		$_sqlProdutoGrade .= " INNER JOIN ProdutoCategoria AS PC ON C.Codigo = PC.CodigoCategoria";
		$_sqlProdutoGrade .= " INNER JOIN Produto AS P ON PC.CodigoProduto = P.Codigo";
		$_sqlProdutoGrade .= " INNER JOIN ProdutoGrade AS PG ON P.Codigo = PG.CodigoProduto";
		$_sqlProdutoGrade .= " WHERE PG.Id = '" . $_idProduto . "' AND PG.Liberado = 'Liberado' GROUP by PG.Id";
		
		$_queryProdutoGrade = mysql_query($_sqlProdutoGrade);		
		
		if(mysql_num_rows($_queryProdutoGrade) > 0) {
			while($_rsProdutoGrade = mysql_fetch_array($_queryProdutoGrade)) {
				if (array_key_exists($_rsProdutoGrade["CodigoProdutoGrade"], $_SESSION["CART"])){
					$_quant = $_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["quantidade"];
					if(($_quant+1)<=$_rsProdutoGrade["Disponivel"]){
						$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["quantidade"]++;
					}else{
						echo "<script> alert('A quantidade solicitada não dispõe de estoque no momento!');</script>";
					}
				}else{
					//PRODUTO GRADE
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["id"] = $_rsProdutoGrade["Id_ProdutoGrade"];
					//$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["codigo"] = $_rsProdutoGrade["CodigoProdutoGrade"]; 
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["codigo_produto"] = $_rsProdutoGrade["CodigoProduto"];
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["codigo_produto_grade"] = $_rsProdutoGrade["CodigoProdutoGrade"]; 
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["descricao"] = $_rsProdutoGrade["Descricao"];
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["estoque_reserva"] = $_rsProdutoGrade["Disponivel"];				
					
					//PRODUTO
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["id_produto"] = $_rsProdutoGrade["Id_Produto"]; 
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["promocao"] = $_rsProdutoGrade["Promocao"]; 
					
					if($_rsProdutoGrade["Promocao"]=="Promoção") 
						$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["valor"] = $_rsProdutoGrade["ValorSaidaPromocao"];
					else
						$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["valor"] = $_rsProdutoGrade["ValorSaida"];
					
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["quant_parcelas_sem_juros"] = $_rsProdutoGrade["QuantidadeParcelasSemJuros"]>0?$_rsProdutoGrade["QuantidadeParcelasSemJuros"]:1;
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["quant_parcelas_com_juros"] = $_rsProdutoGrade["QuantidadeParcelas"]>0?$_rsProdutoGrade["QuantidadeParcelas"]:1;
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["codigo_grupo"] = $_rsProdutoGrade["Codigo_Grupo"];
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["departamento"] = $_rsProdutoGrade["Departamento"];
					
					//if($_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["quantidade"]==0) 
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["quantidade"] = 1;
					
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["transportadora"] = $_rsProdutoGrade["Transportadora"];
					
					//****************************************************************************************
					
					$_coda = "../produtos/" . $_rsProdutoGrade["CodigoProdutoGrade"];
					@$_files = glob("{$_coda}/*.jpg");
					count(@$_files);
					$_total = strlen(@$_files[0]);
					if( $_total==0){
						unset ($_files);
					}
					
					if (count(@$_files)>0)
						$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["url_imagem"] = "actions/img.php?l=60&a=58&local=" . $_files[0];
					else
						$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["url_imagem"] = "actions/img.php?l=60&a=58&local=../imagens/sem_imagem.jpg";
					
					//FRETE
				
					//ver com Gustavo (coisa do guilherme)
					/*if ($_produto->getField('FreteGratis')=="FreteGratis"){
						$_SESSION["CART"][$_produto->getField("Codigo")]["frete_gratis"] = 1;
						$_SESSION["CART"][$_produto->getField("Codigo")]["peso"] = 0;
					}else{*/
					
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["frete_gratis"] = 0;
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["peso"] = str_replace(",", ".", $_rsProdutoGrade["PesoBruto"]);					
					//}
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["altura"] = str_replace(",", ".", $_rsProdutoGrade["Altura"]);			
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["largura"] = str_replace(",", ".", $_rsProdutoGrade["Largura"]);				
					$_SESSION["CART"][$_rsProdutoGrade["CodigoProdutoGrade"]]["comprimento"] = str_replace(",", ".", $_rsProdutoGrade["Comprimento"]);
				}
			} 
			
			echo "<script> window.location.href = '../carrinho'; </script>";
			die;
		} else {
			echo "<script> alert('Ocorreu algum erro durante a operação.') </script>";
			die;
		}
	
	//ALTERAR QUANTIDADE PRODUTO		
	} else if(@$_GET["acao"]=="quantidade") {
		if (@$_SESSION["PEDIDO"]["USUARIO"]!="")
			@$_SESSION["PEDIDO"]["CARRINHO_ALTERADO"] = true;
		
		$_sqlProdutoGrade = "SELECT PG.Disponivel FROM ProdutoGrade AS PG WHERE PG.CodigoProdutoGrade = " . @$_POST["codigo_produto_grade"];
		//echo $_sqlProdutoGrade;
		$_queryProdutoGrade = mysql_query($_sqlProdutoGrade);
		
		if (@mysql_num_rows($_queryProdutoGrade) > 0) {
			if (is_numeric(@$_POST["quantidade"]) and @$_POST["quantidade"] > 0) {
				$_rsProdutoGrade = mysql_result($_queryProdutoGrade,0,'Disponivel');
				$disponivel = $_rsProdutoGrade;
				
				if (@$_POST["quantidade"] <= $disponivel) {
					$_SESSION["CART"][@$_POST["codigo_produto_grade"]]["quantidade"] = @$_POST["quantidade"];
					
				} else {
					echo "<script> alert('A quantidade solicitada não dispõe de estoque no momento!');</script>";
				}
			} else {
				$_SESSION["CART"][@$_POST["codigo_produto_grade"]]["quantidade"] = 1;
			}
		}
		
		$_load = "<script> $(\"html,body\").animate({scrollTop: $(\"\").offset().top},'slow'); </script>";
	//REMOVER PRODUTO	
	} else if(@$_GET["acao"]=="remover") {
		if (@$_SESSION["PEDIDO"]["USUARIO"]!="")
			@$_SESSION["PEDIDO"]["CARRINHO_ALTERADO"] = true;
		
		unset($_SESSION["CART"][@$_POST["codigo_produto_grade"]]);
	}
	
	if(count($_SESSION["CART"])<1) {
		echo "<script> window.location.href = 'produtos'; </script>";
		die;
	}
	
	$_arrayFrete = array();
	$_erroFrete = false;
	$_calculaFrete = false;
	$_valorFrete = 0;
	
	//CÁLCULO DO FRETE	
	if(@$_POST["cep_ini"]!="" && @$_POST["cep_fim"]!="") {
		$_calculaFrete = true;
		
		$_cep = @$_POST["cep_ini"] . @$_POST["cep_fim"];	
		
		$_chaves = array_keys($_SESSION["CART"]);
		
		$_transportadora = false;
		$_peso = 0;
		$_volume = 0;
		
		for($_i=0; $_i < count($_chaves); $_i++) {
			$_transportadora = $_SESSION["CART"][$_chaves[$_i]]["transportadora"]=="Transportadora"?true:$_transportadora;
			
			$_peso += ($_SESSION["CART"][$_chaves[$_i]]["quantidade"] * $_SESSION["CART"][$_chaves[$_i]]["peso"]);			
			$_volume += ($_SESSION["CART"][$_chaves[$_i]]["altura"] * $_SESSION["CART"][$_chaves[$_i]]["largura"] * $_SESSION["CART"][$_chaves[$_i]]["comprimento"] * $_SESSION["CART"][$_chaves[$_i]]["quantidade"]);										 										
		}
 		
 		if ($_transportadora==false){
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
				//$_valorPac = str_replace('.',',',$_frete[0]);
				//$_valorSedex = str_replace('.',',',$_frete[1]);
				$_valorPac = $_frete[0] * $_divisor;
				$_valorSedex = $_frete[1] * $_divisor;
				$_prazoPac = str_replace('.',',',$_frete[2]);
				$_prazoSedex = str_replace('.',',',$_frete[3]);
				
				$_valorFrete = @$_POST["tipo_frete"]=="1"?$_valorSedex:$_valorPac;
				
				$_arrayFrete = array(
									"prazo_pac"=>$_prazoPac,
									"valor_pac"=>$_valorPac,
									"prazo_sedex"=>$_prazoSedex,
									"valor_sedex"=>$_valorSedex
									);
			}else
				$_erroFrete = true;
		}
	}
?>


	  <header>
        <h2>Carrinho de Compras</h2>
        <ol class="passos">
          <li class="ativo"><svg width="24px" height="20px"><use xlink:href="#icone-carrinho" class="icone" /></svg> Carrinho</li>
          <li><svg width="20px" height="20px"><use xlink:href="#icone-usuario" class="icone" /></svg> Identificação</li>
          <li><svg width="24px" height="20px"><use xlink:href="#icone-cartoes" class="icone" /></svg> Pagamento</li>
          <li><svg width="26px" height="20px"><use xlink:href="#icone-check" class="icone" /></svg> Confirmação</li>
        </ol>
      </header>

      <table class="compras tablesaw tablesaw-stack" data-tablesaw-mode="stack">
        <thead>
          <tr>
            <th scope="col">Descrição do item</th>
            <th scope="col">Valor unitário</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Valor total</th>
          </tr>
        </thead>
        <tbody>
          <?php
			$_chaves = array_keys($_SESSION["CART"]);
			$_subTotal = 0;
			
			for($_i = 0; $_i < count($_chaves); $_i++) {
				echo "<tr id=\"" . $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] . "\">";
            	echo "<th scope=\"row\">";
            	echo "<img src=\"" . @$_SESSION["CART"][$_chaves[$_i]]["url_imagem"] . "\" alt=\"" . $_SESSION["CART"][$_chaves[$_i]]["descricao"] . "\">";
            	echo "<p><a href=\"" . URL . "produto/" . geraDescricaoAmigavel($_SESSION["CART"][$_chaves[$_i]]["descricao"]) . "/" . $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] . "\" title=\"Voltar à página deste produto\">" . $_SESSION["CART"][$_chaves[$_i]]["descricao"] . "</a></p>";
            	echo "</th>";
            	echo "<td>R$ " . number_format($_SESSION["CART"][$_chaves[$_i]]["valor"],2,",",".") . "</td>";
            	echo "<td>";
              	echo "<p>";
              	echo "<span class=\"soma subtrair\" alt=\"" . $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] . "\">-</span>";
              	echo "<input type=\"text\" class=\"text_quantidade\" alt=\"" . $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] . "\" value=\"" . $_SESSION["CART"][$_chaves[$_i]]["quantidade"] . "\">";
              	echo "<span class=\"soma somar\" alt=\"" . $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] . "\">+</span>";
              	echo "</p>";
				
				$_strAdd = ",$('#cep-inicial').val(),$('#cep-final').val()" . ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":"");
				
              	echo "<a href=\"javascript:carregarLista('remover','" . $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] . "',''" . $_strAdd . ")\" title=\"Remover item do carrinho\">Remover</a>";
            	echo "</td>";
            	echo "<td>R$ " . number_format(($_SESSION["CART"][$_chaves[$_i]]["valor"]*$_SESSION["CART"][$_chaves[$_i]]["quantidade"]),2,",",".") . "</td>";
          		echo "</tr>";
				
				$_subTotal += ($_SESSION["CART"][$_chaves[$_i]]["valor"]*$_SESSION["CART"][$_chaves[$_i]]["quantidade"]);
			}
		  ?>
        </tbody>
      </table>

      <div class="cep">
        <form action="#" onsubmit="return false">
          <fieldset>
            <p title="Digite o CEP da entrega para calcular os custos com frete"><svg width="23px" height="16px"><use xlink:href="#icone-frete" class="icone" /></svg> Calcule o frete e prazo para entrega:</p>
            <p>
            	<input class="grande" type="text" name="cep-inicial" id="cep-inicial" value="<?php echo @$_POST["cep_ini"]!=""?@$_POST["cep_ini"]:""; ?>" maxlength="5">
				<input class="pequeno" type="text" name="cep-final" id="cep-final" value="<?php echo @$_POST["cep_fim"]!=""?@$_POST["cep_fim"]:""; ?>" maxlength="3">
				<button type="submit">Calcular</button>
			</p>
            <a href="http://www.buscacep.correios.com.br/sistemas/buscacep/" rel="external" title="Encontrar seu CEP">Não sei meu CEP</a>
          </fieldset>
        </form>
        <?php
         	if ($_calculaFrete){
        		echo "<div class=\"resultado\">";
          		//echo "<!--<p>Av. Sete de Setembro, Batel - Curitiba/PR</p>-->";
          		echo "<table>";
            	echo "<tbody>";
            	
             	if ($_erroFrete==false && $_transportadora==false){ 
	            	echo "<tr>";
	                echo "<th scope=\"row\">";
	                echo "<label><input type=\"radio\" name=\"tipo-frete\" id=\"tipo-frete\" value=\"0\" " . (@$_POST["tipo_frete"]=="0"||@$_POST["tipo_frete"]==""?"checked=\"checked\"":"") . "> R$" . number_format($_arrayFrete["valor_pac"],2,",",".") . "</label></th>";
	                echo "<td>PAC</td>";
	                echo "<td>" . ($_arrayFrete["prazo_pac"]) . " dias úteis após a postagem</td>";
	              	echo "</tr>";
					echo "<tr>";
	                echo "<th scope=\"row\">";
	                echo "<label><input type=\"radio\" name=\"tipo-frete\" id=\"tipo-frete\" value=\"1\" " . (@$_POST["tipo_frete"]=="1"?"checked=\"checked\"":"") . "> R$" . number_format($_arrayFrete["valor_sedex"],2,",",".") . "</label></th>";
	                echo "<td>SEDEX</td>";
	                echo "<td>" . ($_arrayFrete["prazo_sedex"]) . " dias úteis após a postagem</td>";
	              	echo "</tr>";
				}else if ($_transportadora){
					echo "<tr>";
					echo "<td>ENTREGA EXCLUSIVA POR TRANSPORTADORA!</td>";
					echo "</tr>";
					echo "<tr>";
					echo "<td>CONSULTE A LOJA PARA VER TAXA E PREÇOS DE ENTREGA PELO TELEFONE " . TELEFONE . " OU PELO E-MAIL plander@plander.com.br</td>";
					echo "</tr>";
				}else{
					echo "<tr>";
					echo "<td>Ocorreu algum erro durante o cálculo! Tente novamente mais tarde!</td>";
					echo "</tr>";
				}
				
            	echo "</tbody>";
          		echo "</table>";
        		echo "</div>";
				
				echo "<script> $(\".resultado\").slideDown(); </script>";
			}
		?>
      </div>

      <div class="total">
        <table>
          <tbody>
            <tr>
              <th scope="row">Subtotal</th>
              <td>R$ <?php echo number_format($_subTotal,2,",","."); ?></td>
            </tr>
            <tr>
              <th scope="row">Frete</th>
              <td>R$ <?php echo number_format($_valorFrete,2,",","."); ?></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td>R$ <?php echo number_format($_subTotal+$_valorFrete,2,",","."); ?></td>
            </tr>
          </tfoot>
        </table>
        <a href="<?php echo URL_SSL; ?>carrinhoLogin" class="botao action" title="Continuar com a compra">Continuar <svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
      </div>

      <a href="<?php echo URL; ?>produtos" class="botao voltar" title="Voltar e comprar mais produtos"><svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg> Comprar mais produtos</a>


<script>
	$('.compras').table().data("table").refresh();
	
	$(".subtrair").click(function(){
		var idProd = $(this).attr("alt");
		
		var objQuant = $("#" + idProd + " td p .text_quantidade");
		
		var quant = 0;
		
		try {
			quant = parseInt(objQuant.val());
			quant--;
			
			carregarLista("quantidade",idProd,(quant)+"",$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":""); ?>);
		}catch(err) {
			carregarLista("quantidade",idProd,"1",$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":""); ?>);
		}
	});
	
	$(".somar").click(function(){
		var idProd = $(this).attr("alt");
		
		var objQuant = $("#" + idProd + " td p .text_quantidade");
		
		var quant = 0;
		
		try {
			quant = parseInt(objQuant.val());
			quant++;
			
			carregarLista("quantidade",idProd,(quant)+"",$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":""); ?>);
		}catch(err) {
			carregarLista("quantidade",idProd,"1",$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":""); ?>);
		}
	});
	
	
	
	
	$(".text_quantidade").blur(function(){
		var idProd = $(this).attr("alt");
		
		var objQuant = $("#" + idProd + " td p .text_quantidade");
		
		var quant = 0;
		
		try {
			quant = parseInt(objQuant.val());
			//quant++;
			
			carregarLista("quantidade",idProd,(quant)+"",$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":""); ?>);
		}catch(err) {
			carregarLista("quantidade",idProd,"1",$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":""); ?>);
		}
	});
	
	$(".text_quantidade").keypress(function(e) {
    	if(e.which == 13)
			$(this).blur();
	});
	
	$("#cep-inicial").keyup(function() {
        var valor = $("#cep-inicial").val().replace(/[^0-9]+/g,'');
        $("#cep-inicial").val(valor);
        
        if ($("#cep-inicial").val().length==5)
            $("#cep-final").focus();
    }); 
    
    $("#cep-final").keyup(function(e) {
        var valor = $("#cep-final").val().replace(/[^0-9]+/g,'');
        $("#cep-final").val(valor);
    });
    
    $(".cep form fieldset p button").click(function() {
    	if ($("#cep-inicial").val() == "" || $("#cep-final").val() == "")
            alert("Preencha o cep antes de prosseguir!");
        else{
        	carregarLista(null,null,null,$("#cep-inicial").val(),$("#cep-final").val()<?php echo ($_calculaFrete&&$_erroFrete==false?",$('input[name=tipo-frete]:checked').val()":",'0'"); ?>);
        	//$(".resultado").slideUp();
        	//$(".resultado table tbody").html("");
        }
     });
	
	<?php
		if ($_calculaFrete&&$_erroFrete==false){
	?>
			$('input[name=tipo-frete]').click(function(){
				$(".cep form fieldset p button").click();
			});
	<?php
		}
	?>
	
	$('#mytable').table().data( "table" ).refresh();
</script>