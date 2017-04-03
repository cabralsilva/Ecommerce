<!-- abre .coluna -->
<aside class="coluna">
  <div>
  	<?php
  		$_dep = $_GET["depar"]!=""?$_GET["depar"]:"Corda";
  		
		$_tipos = array_keys($_SESSION["GRUPO"][$_dep]);
// 		if(isset($_SESSION["GRUPO"][$_dep]))
// 			$_tipos = array_keys($_SESSION["GRUPO"][$_dep]);
		
		print_r($_tipos);

		for ($_x=0; $_x < count($_tipos); $_x++) {
			echo "<h3>";
			echo "<a href=\"" . URL . "produtos/tipo/" . removerAcento($_dep) . "/" . removerAcento($_tipos[$_x]) . "\" title=\"Ver produtos do tipo " . $_tipos[$_x] . "\">";
			echo "" . $_tipos[$_x] . " <svg width=\"7px\" height=\"13px\"><use xlink:href=\"#icone-seta\" class=\"icone\" /></svg>";
			echo "</a>";
			echo "</h3>";
			
			$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipos[$_x]]);
			
			echo "<ul>";
	  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
				echo "<li>";
				echo "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
				echo "/" . removerAcento($_tipos[$_x]);
				echo "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipos[$_x]][$_codigoGrupo[$_i]]["nome"]);
				echo "/" . $_SESSION["GRUPO"][$_dep][$_tipos[$_x]][$_codigoGrupo[$_i]]["codigo"] . "\"";
				echo " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipos[$_x]][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipos[$_x]][$_codigoGrupo[$_i]]["nome"],"UTF-8");
				echo "</a>";
				
				$_cats = @$_SESSION["GRUPO"][$_dep][$_tipos[$_x]][$_codigoGrupo[$_i]]["categorias"];
				if (is_array($_cats)){
					echo "<ul>";
					for ($_z=0; $_z < count($_cats); $_z++) {
						echo "<li>";
						echo "<a href=\"" . URL . "produtos/categoria/" . removerAcento($_dep);
						echo "/" . removerAcento($_tipos[$_x]);
						echo "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipos[$_x]][$_codigoGrupo[$_i]]["nome"]);
						echo "/" . removerAcento($_cats[$_z]["nome"]);
						echo "/" . $_cats[$_z]["codigo"] . "\"";
						echo " title=\"Ver produtos da categoria " . $_cats[$_z]["nome"] . "\">" . mb_strtoupper($_cats[$_z]["nome"],"UTF-8");
						echo "</a>";
					}
					echo "</ul>";
				}
				
				echo "</li>";
			}
			echo "</ul>";
		}
  	?>
    <div class="filtros">
      <h4>Filtrar por</h4>
      <form action="#" onsubmit="return false">
      	<!--
        <fieldset>
          <p>Valor</p>
          <label for="valor-inicial">R$</label> <input class="pequeno" value="0,00" type="text" name="valor-inicial" id="valor-inicial">
          <label for="valor-final">até R$</label> <input class="grande" value="0,00" type="text" name="valor-final" id="valor-final">
          <button type="submit">OK</button>
        </fieldset>
       -->
        <fieldset>
          <p>Marcas</p>
          <ol>
          	<?php
				$sql_fabricante = "SELECT * FROM Fabricante WHERE Liberado = 'Liberado'";
		        $qry_fabricante = mysql_query($sql_fabricante);
				while($rs_fabricante = mysql_fetch_array($qry_fabricante)) {
					$codigo_fabricante = $rs_fabricante['Codigo'];  
					$nome_fabricante = $rs_fabricante['Nome'];  
					
					echo "<li>";
					echo "<a href=\"javascript:void(0);\" onclick=\"window.location.href='" . URL . "produtos/busca/" . $nome_fabricante . "';\" title=\"Ver produtos da marca " . $nome_fabricante . "\">";
					echo $nome_fabricante;
					echo "</a>";
					echo "</li>";
		         }
			 ?>
          </ol>
        </fieldset>
      </form>
    </div>
  </div>
  <?php
  	/*
  	@$_bannerLat = glob("banners/lateral/*.jpg");
	$_totalLat = strlen(@$_bannerLat[0]);
	
	if ($_totalLat>0)
		echo "<a href=\"javascript:void(0);\" class=\"banner\"><img src=\"actions/img.php?l=280&a=590&local=../" . $_bannerLat[0] . "\" alt=\"\"></a>";
	 *
	 */
  ?>
</aside>
<!-- fecha .coluna -->