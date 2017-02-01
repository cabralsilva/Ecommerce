<?php
	@session_start();
	
	require_once("../class/constantes.php"); 
	require_once("../class/filemaker.class.php");
	require_once("../actions/funcoes.php");
	
	//*******************************************************************
	
	$_pagina = @$_POST["pagina"];
		
	if ($_pagina == "" or $_pagina == 0)
		$_pagina = 1;
	
	$_ordenacao = @$_POST["ordenacao"];
	
	//*******************************************************************
	
	$_limiteProdutos = 12;
	$_inicio = $_limiteProdutos*($_pagina-1);
	
	//*******************************************************************
	
	$_sqlProdutoGrade = "SELECT SQL_CALC_FOUND_ROWS P.Codigo, PG.CodigoProduto, P.Id, PG.Descricao, P.Promocao, P.ValorSaida, P.ValorSaidaPromocao, PG.CodigoProdutoGrade, P.QuantidadeParcelasSemJuros";
	$_sqlProdutoGrade .= " FROM Grupo AS G";
	$_sqlProdutoGrade .= " INNER JOIN Categoria AS C ON G.Codigo = C.CodigoGrupo";
	$_sqlProdutoGrade .= " INNER JOIN ProdutoCategoria AS PC ON C.Codigo = PC.CodigoCategoria";
	$_sqlProdutoGrade .= " INNER JOIN Produto AS P ON PC.CodigoProduto = P.Codigo";
	$_sqlProdutoGrade .= " INNER JOIN ProdutoGrade AS PG ON P.Codigo = PG.CodigoProduto";
	
	$_sqlProdutoGrade .= " WHERE P.Liberado = 'Liberado'";
	$_sqlProdutoGrade .= " and G.Liberado = 'Liberado'";
	$_sqlProdutoGrade .= " and C.Liberado = 'Liberado'";
	
	if(@$_POST["depar"]!="")
		$_sqlProdutoGrade .= " and G.Departamento = '" . @$_POST["depar"]."'";
	
	if(@$_POST["tipo"]!="")
		$_sqlProdutoGrade .= " and G.Tipo = '" . @$_POST["tipo"]."'";
	
	if(@$_POST["codigo_grupo"]!="")
		$_sqlProdutoGrade .= " and G.Codigo = '" . @$_POST["codigo_grupo"]."'";
	
	if(@$_POST["codigo_categoria"]!="")
		$_sqlProdutoGrade .= " and C.Codigo = '" . @$_POST["codigo_categoria"]."'";
	
	if(trim(@$_POST["busca"])!=""){
		$_pesquisa = str_replace( array( ',', '.', '%', '-', '/', '\\' ),' ', trim(@$_POST["busca"])); //Salva o que foi buscado em uma variável
		$_pesquisa = mysql_real_escape_string($_pesquisa);	
		$_buscaSite = explode(" ", $_pesquisa); //dividindo as palavras pelo espaço
		$_buscaSite = array_filter($_buscaSite); //eliminando itens vazios
		
		for ($_i=0; $_i < count($_buscaSite); $_i++)  
			$_sqlProdutoGrade .= " and PG.DescricaoGradeWeb LIKE '%" . mysql_real_escape_string($_buscaSite[$_i]) . "%'";
	}
	
	$_sqlProdutoGrade .= " GROUP BY PG.CodigoProdutoGrade";
	$_sqlProdutoGrade .= " ORDER BY " . $_ordenacao;
	
	$_sqlProdutoGrade .= " LIMIT $_inicio,$_limiteProdutos";
	
	$_queryProdutos = mysql_query($_sqlProdutoGrade);
	$_encontrados = mysql_num_rows($_queryProdutos);
	$_totalGeral = mysql_result(mysql_query("SELECT FOUND_ROWS()"),0,0);
	
	if($_pagina=="1") {
?>
		<header>
        	<!--<h2>Instrumento Infantil</h2>-->
        	<!--<img src="imagens/categoria.jpg" alt="Cordas">-->
        	<?php
        		@$_bannerProd = glob("../banners/produtos/*.jpg");
				$_totalProd = strlen(@$_bannerProd[0]);
				
				if ($_totalProd>0)
					echo "<img src=\"" . URL . "actions/img.php?l=905&a=200&local=" . $_bannerProd[0] . "\" alt=\"\">";
        	?>
      	</header>
		
		<form action="#" class="filtros">
			<fieldset>
			  <label for="encontrados">Encontrados: <strong style="margin-right:30px;"><?php echo $_totalGeral; ?></strong></label>
			  <label for="ordenar">Ordenar por:</label>
			  <div class="select">
			    <select name="ordenar" id="ordenar">
			      <option value="PG.Descricao ASC" <?php echo strtoupper($_ordenacao)==strtoupper("PG.Descricao ASC")?"selected=\"selected\" ":""; ?>>Descrição A-Z</option>
			      <option value="PG.Descricao DESC" <?php echo strtoupper($_ordenacao)==strtoupper("PG.Descricao DESC")?"selected=\"selected\" ":""; ?>>Descrição Z-A</option>
			      <option value="P.ValorSaida ASC" <?php echo strtoupper($_ordenacao)==strtoupper("P.ValorSaida ASC")?"selected=\"selected\" ":""; ?>>Menor valor</option>
			      <option value="P.ValorSaida DESC" <?php echo strtoupper($_ordenacao)==strtoupper("P.ValorSaida DESC")?"selected=\"selected\" ":""; ?>>Maior valor</option>
			    </select>
			  </div>
			</fieldset>
		</form>
		<script>
			$("#ordenar").change(function(){
				buscar(null, $(this).val());
			});
		</script>
	<?php
	}
	
	if($_encontrados>0) {
		while($_resultProdutos = mysql_fetch_array($_queryProdutos)) {
			$_cod = "../produtos/".$_resultProdutos["CodigoProdutoGrade"];
		    $_files = glob("{$_cod}/*.*");
            $_linha = @$_files[0];
			
			$_total = count($_files);
			for($_i=0; $_i<$_total; $_i++){
				if( (pathinfo($_files[$_i], PATHINFO_EXTENSION) == "jpg") and !temAcento($_files[$_i])){								
					$_linha = $_mostra_foto = $_files[$_i];
					$_i = $_total;
				}
			}
			
			$_urlImagem = "";
			if($_linha)
				$_urlImagem = "actions/img.php?l=202&a=194&local=" . $_linha;
			else
				$_urlImagem = "actions/img.php?l=202&a=194&local=../imagens/sem_imagem.jpg";
			
			//********************************************************************************************************
			
			$_linkProduto = "produto/" . geraDescricaoAmigavel($_resultProdutos["Descricao"]) . "/" . $_resultProdutos["CodigoProdutoGrade"];
			
			echo "<div class=\"produto\" itemscope itemtype=\"http://schema.org/Product\">";
		    echo "<a itemprop=\"url\" href=\"" . URL . "" . $_linkProduto . "\" title=\"Visitar a página deste produto\">";
			echo "<img src=\"" . URL . "" . $_urlImagem . "\" alt=\"" . $_resultProdutos["Descricao"] . "\" itemprop=\"image\">";
			echo "<p itemprop=\"name\">" . mySubstring($_resultProdutos["Descricao"],SUBSTR_PRODUTO) . "</p>";
		    echo "<div itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">";
			
			//********************************************************************************************************
			
		    $_valorCalculo = $_resultProdutos["ValorSaida"];
		    if($_resultProdutos["Promocao"]=="Promoção") {
		    	$_valorCalculo = $_resultProdutos["ValorSaidaPromocao"];
				echo "<span class=\"de\"><span>de R$ " . number_format($_resultProdutos["ValorSaida"],2,",",".") . "</span></span>";
		        echo "<span class=\"por\">por <span itemprop=\"price\">R$ " . number_format($_resultProdutos["ValorSaidaPromocao"],2,",",".") . "</span></span>";
			}else
				echo "<span class=\"por\"><span itemprop=\"price\">R$ " . number_format($_resultProdutos["ValorSaidaPromocao"],2,",",".") . "</span></span>";
			
			$_parcelasSJ = $_resultProdutos["QuantidadeParcelasSemJuros"]>0?$_resultProdutos["QuantidadeParcelasSemJuros"]:1;
			
		    echo "<em>em até " . $_parcelasSJ . "x de R$ " . number_format($_valorCalculo/$_parcelasSJ,2,",",".") . " sem juros</em>";
		    echo "</div>";
			echo "</a>";
		    echo "<a href=\"" . URL . "" . $_linkProduto . "\" class=\"botao call\" title=\"Visitar a página do produto\">Mais detalhes <svg width=\"5px\" height=\"9px\"><use xlink:href=\"#icone-seta\" class=\"icone\" /></svg>";
			echo "</a>";
			echo "</div>";
		}
		
		if(($_limiteProdutos * $_pagina) < $_totalGeral)
			echo "<p id=\"linkMais\" class=\"centro\"><a class=\"botao\" href=\"javascript:void(0);\" onclick=\"buscar('" . ($_pagina+1) . "',null);\" title=\"Carregar mais produtos\">Carregar mais</a></p>";
	} else {
		//if($_pagina=="1")
			//echo "<div style='color:#06F; font-size:40px; margin-left:10px;'>Nenhum produto foi encontrado!</div>";
	}
?>