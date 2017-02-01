<?php
	require_once("class/constantes.php");
	require_once("class/filemaker.class.php");
	require_once("actions/funcoes.php");		

	if((!is_array(@$_SESSION["GRUPO"]) || count(@$_SESSION["GRUPO"])==0) && (!is_array(@$_SESSION["GRUPO2"]) || count(@$_SESSION["GRUPO2"])==0)){
		//$_sqlGrupo = "SELECT DISTINCT G.Codigo, G.Nome, G.Tipo, G.Departamento FROM Grupo AS G INNER JOIN Categoria AS C ON G.Codigo = C.CodigoGrupo WHERE G.Liberado = 'Liberado' AND C.Liberado = 'Liberado' ORDER BY G.Nome ASC";
		$_sqlGrupo = "SELECT DISTINCT G.Codigo, G.Nome, G.Tipo, G.Departamento FROM Grupo AS G WHERE G.Liberado = 'Liberado' ORDER BY G.Nome ASC";
		$_queryGrupo = mysql_query($_sqlGrupo);
		
		$_SESSION["GRUPO"] = array();
		$_SESSION["GRUPO2"] = array();
		
		while($_resultGrupo = mysql_fetch_array($_queryGrupo)) {
			$_SESSION["GRUPO"]
					 [$_resultGrupo["Departamento"]]
					 [$_resultGrupo["Tipo"]][$_resultGrupo["Codigo"]] = array(
					 															"codigo"=>$_resultGrupo['Codigo'],
																				"nome"=>maiusculaFM($_resultGrupo['Nome']),
																				"tipo"=>$_resultGrupo['Tipo'],
																				"departamento"=>$_resultGrupo['Departamento']
																				);
			
			/*
			$_SESSION["GRUPO2"][$_resultGrupo["Codigo"]] = array(
																"codigo"=>$_resultGrupo['Codigo'],
																"nome"=>maiusculaFM($_resultGrupo['Nome']),
																"tipo"=>$_resultGrupo['Tipo'],
																"departamento"=>$_resultGrupo['Departamento']
																);
			*/
			$_sqlCategoria = "SELECT C.Codigo, C.Nome AS Nome_Categoria FROM Categoria C WHERE C.CodigoGrupo = '" . $_resultGrupo["Codigo"] . "' and C.Liberado='Liberado'";
			$_queryCategoria = mysql_query($_sqlCategoria);
			$_encontrados = mysql_num_rows($_queryCategoria);
			
			//a primeira cat é sempre o mesmo grupo... depois fazer busca somente nas categorias
			if ($_encontrados>1){
				$_x = 0;
				$_x2 = 0;
				while($_resultCategoria = mysql_fetch_array($_queryCategoria)){
					if ($_x2>=0){
						$_SESSION["GRUPO"]
							 [$_resultGrupo["Departamento"]]
							 [$_resultGrupo["Tipo"]][$_resultGrupo["Codigo"]]
							 ["categorias"][$_x] = array(
													"codigo"=>$_resultCategoria["Codigo"],
													"nome"=>maiusculaFM($_resultCategoria["Nome_Categoria"])
													);
						$_x++;
					}
					
					$_x2++;
				}
			}
			
			/*
			$_SESSION["GRUPO"][count($_SESSION["GRUPO"])] = array(
																	"codigo"=>$_resultGrupo['Codigo'],
																	"nome"=>maiusculaFM($_resultGrupo['Nome']),
																	"tipo"=>$_resultGrupo['Tipo'],
																	"Departamento"=>$_resultGrupo['Departamento'],
																	"contador"=>$quantidadeCategoria
																	//"categoria"=>$_resultGrupo['Nome_Categoria'],
																	//"categorias"=>$_resultGrupo['Codigo_Categoria'],
																	);
			//padronizar depois... $_SESSION[GRUPO][CODIGOGRUPO];
			$_SESSION["GRUPO2"][$_resultGrupo['Codigo']] = array(
																	"codigo"=>$_resultGrupo['Codigo'],
																	"nome"=>maiusculaFM($_resultGrupo['Nome']),
																	"tipo"=>$_resultGrupo['Tipo'],
																	"Departamento"=>$_resultGrupo['Departamento'],
																	"contador"=>$quantidadeCategoria
																	//"categoria"=>$_resultGrupo['Nome_Categoria'],
																	//"codigoCategoria"=>$_resultGrupo['Codigo_Categoria'],
																	);
			 *
			 */
		}
	}
	
	if (@$_SESSION["PEDIDO"]["USUARIO"]!=""){
		$_nomeUsuario = explode(" ", $_SESSION[@$_SESSION["PEDIDO"]["USUARIO"]]["nome_principal"]);
		$_nomeUsuario = $_nomeUsuario[0];
	}else{
		$_nomeUsuario = "Visitante";
	}
?>
<!-- abre .topo -->
<header class="topo" role="banner">

  <!-- abre .limites -->
  <div class="limites">

    <h1><a href="<?php echo URL; ?>index" title="Voltar à página inicial"><img src="<?php echo URL; ?>imagens/logo.png" alt="Plander.com"></a></h1>

    <span class="menu" role="presentation">
      Menu
      <svg version="1.1" id="icone-menu" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="20.7px" viewBox="0 0 26 20.7" enable-background="new 0 0 26 20.7" xml:space="preserve">
        <path id="menu-linha1" d="M25.2,3.9H0.8C0.4,3.9,0,3.5,0,3.1V0.8C0,0.4,0.4,0,0.8,0h24.4C25.6,0,26,0.4,26,0.8v2.3C26,3.5,25.6,3.9,25.2,3.9z"/>
        <path id="menu-linha2" d="M25.2,12.3H0.8c-0.5,0-0.8-0.4-0.8-0.8V9.2c0-0.5,0.4-0.8,0.8-0.8h24.4c0.5,0,0.8,0.4,0.8,0.8v2.3C26,11.9,25.6,12.3,25.2,12.3z"/>
        <path id="menu-linha3" d="M25.2,20.7H0.8c-0.5,0-0.8-0.4-0.8-0.8v-2.3c0-0.5,0.4-0.8,0.8-0.8h24.4c0.5,0,0.8,0.4,0.8,0.8v2.3C26,20.3,25.6,20.7,25.2,20.7z"/>
      </svg>
    </span>

    <!-- abre navegações -->
    <ul class="institucional">
      <li><a href="<?php echo URL; ?>quemSomos" title="Visitar a página Sobre a Plander">Sobre a Plander</a></li>
      <li><a href="<?php echo URL; ?>faleConosco" title="Visitar a página Fale Conosco">Fale Conosco</a></li>
    </ul>
    <ul class="contatos">
      <li><a href="javascript:void(window.open('http://www.plander.com.br/livezilla/chat.php?a=34169','','width=590,height=760,left=0,top=0,resizable=yes,menubar=no,location=no,status=yes,scrollbars=yes'))" title="Visitar o Atendimento Online"><svg width="23px" height="20px"><use xlink:href="#icone-atendimento" class="icone" /></svg> Atendimento Online</a></li>
      <li class="telefone"><strong><svg width="20px" height="20px"><use xlink:href="#icone-telefone" class="icone" /></svg> Televendas | <?php echo TELEFONE; ?></strong></li>
      <li class="whatsapp"><strong><img src="<?php echo URL; ?>imagens/icone-whatsapp.png" alt="WhatsApp"> <?php echo CELULAR; ?></strong></li>
    </ul>

    <nav>
      <ul>
        <li class="drop">
          <a href="<?php echo URL; ?>produtos/depar/Corda" title="Ver produtos do departamento Cordas">Cordas <svg width="7px" height="13px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
          <div class="dropdown">
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/tipo/Corda/Acessorio" title="Ver produtos do tipo Acessório">Acessório</a></h3>
              <ul>
			  	<?php
			  		$_dep = "Corda";
					$_tipo = "Acessório";
					$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/tipo/Corda/Instrumento" title="Ver produtos do tipo Instrumento">Instrumento</a></h3>
              <ul>
                <?php
			  		$_dep = "Corda";
					$_tipo = "Instrumento";
			  		$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
          </div>
        </li>

        <li class="drop">
          <a href="<?php echo URL; ?>produtos/depar/Sopro" title="Ver produtos do departamento Sopros">Sopros <svg width="7px" height="13px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
          <div class="dropdown">
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/tipo/Sopro/Acessorio" title="Ver produtos do tipo Acessório">Acessório</a></h3>
              <ul>
                <?php
			  		$_dep = "Sopro";
					$_tipo = "Acessório";
			  		$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/tipo/Sopro/Instrumento" title="Ver produtos do tipo Instrumento">Instrumento</a></h3>
              <ul>
                <?php
			  		$_dep = "Sopro";
					$_tipo = "Instrumento";
			  		$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
          </div>
        </li>

        <li class="drop">
          <a href="<?php echo URL; ?>produtos/depar/Tecla" title="Ver produtos do departamento Teclas">Teclas <svg width="7px" height="13px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
          <div class="dropdown">
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/tipo/Tecla/Acessorio" title="Ver produtos do tipo Acessório">Acessório</a></h3>
              <ul>
                <?php
			  		$_dep = "Tecla";
					$_tipo = "Acessório";
			  		$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/tipo/Tecla/Instrumento" title="Ver produtos do tipo Instrumento">Instrumento</a></h3>
              <ul>
                <?php
			  		$_dep = "Tecla";
					$_tipo = "Instrumento";
			  		$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
          </div>
        </li>

        <li class="drop">
          <a href="<?php echo URL; ?>produtos/depar/Livraria" title="Ver produtos do departamento Livraria">Livraria <svg width="7px" height="13px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
          <div class="dropdown">
            <div class="subcategoria">
              <h3><a href="<?php echo URL; ?>produtos/depar/Livraria" title="Ver produtos do tipo Acessório">Livraria</a></h3>
              <ul>
                <?php
			  		$_dep = "Livraria";
					$_tipo = "Livraria";
			  		$_codigoGrupo = array_keys($_SESSION["GRUPO"][$_dep][$_tipo]);
					
			  		for ($_i=0; $_i < count($_codigoGrupo); $_i++) { 
						$_li = "<li>";
						$_li .= "<a href=\"" . URL . "produtos/grupo/" . removerAcento($_dep);
						$_li .= "/" . removerAcento($_tipo);
						$_li .= "/" . removerAcento($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"]);
						$_li .= "/" . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["codigo"] . "\"";
						$_li .= " title=\"Ver produtos do grupo " . $_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"] . "\">" . mb_strtoupper($_SESSION["GRUPO"][$_dep][$_tipo][$_codigoGrupo[$_i]]["nome"],"UTF-8");
						$_li .= "</a>";
						$_li .= "</li>";
						
						echo $_li;
					}
              	?>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>

    <div class="drop conta">
      <a href="javascript:void(0);" title="Ver detalhes da conta">Olá <strong><?php echo $_nomeUsuario; ?></strong>. <span>Sua conta <svg width="9px" height="5px"><use xlink:href="#icone-seta-baixo" class="icone" /></svg></span></a>
      <div class="dropdown">
      	<?php
	      	if (@$_SESSION["PEDIDO"]["USUARIO"]!="") {
	    ?>
		        <ul>
		          <li><a href="<?php echo URL; ?>carrinhoCadastro" title="Ver detalhes de sua conta">Sua conta <em>Verifique e edite suas informações</em></a></li>
		          <!--<li><a href="#" title="Ver detalhes de seus pedidos">Seus pedidos <em>Histórico das compras realizadas</em></a></li>-->
		        </ul>
		<?php
      		}else{
      	?>
		        <!-- itens a serem exibidos caso o usuário não esteja logado -->
		        <!-- <a href="login.html" class="botao" title="Entrar em sua conta">Entrar <svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg></a> -->
		        <!-- <p>Novo cliente? <a href="cadastro.html" title="Faça seu cadastro">Faça seu cadastro</a>.</p> -->
		 <?php
      		}
      	 ?>  
      </div>
    </div>

    <div class="drop carrinho">
      <a href="<?php echo URL; ?>carrinho" title="Ver carrinho de compras"><svg width="23px" height="19px"><use xlink:href="#icone-carrinho" class="icone" /></svg> <?php echo count(@$_SESSION["CART"]); ?> <svg width="9px" height="5px"><use xlink:href="#icone-seta-baixo" class="icone" /></svg></a>
      <?php
      	if (count(@$_SESSION["CART"])>0){
      		$_chaves = array_keys($_SESSION["CART"]);
			$_subTotal = 0;
			
			echo "<div class=\"dropdown\">";
	        echo "<table>";
	        echo "<tbody>";
			
			for($_i = 0; $_i < count($_chaves); $_i++) {
				echo "<tr>";
	            echo "<td scope=\"row\"><img src=\"" . URL . @$_SESSION["CART"][$_chaves[$_i]]["url_imagem"] . "\" alt=\"" . $_SESSION["CART"][$_chaves[$_i]]["descricao"] . "\"></td>";
	            echo "<td>" . $_SESSION["CART"][$_chaves[$_i]]["descricao"] . "</td>";
	            echo "<td class=\"valor\">R$ " . number_format(($_SESSION["CART"][$_chaves[$_i]]["valor"]*$_SESSION["CART"][$_chaves[$_i]]["quantidade"]),2,",",".") . "</td>";
	            echo "</tr>";
			}
			
      	    echo "</tbody>";
	        echo "</table>";
	        echo "<a href=\"" . URL . "carrinho\" title=\"Ver e editar o carrinho de compras\">Ver e editar o carrinho de compras</a>";
	        echo "<a href=\"" . URL . "carrinhoLogin\" class=\"botao direita\" title=\"Fechar o pedido\">Fechar o pedido <svg width=\"8px\" height=\"15px\"><use xlink:href=\"#icone-seta\" class=\"icone\" /></svg></a>";
	      	echo "</div>";
	  	}
	  ?>
      <!--
	      <div class="dropdown">
	        <table>
	          <tbody>
	            <tr>
	              <td scope="row"><img src="imagens/produto.jpg" alt="Produto"></td>
	              <td>Exclusive Meinl Classics Custom Cymbal Set</td>
	              <td class="valor">R$999,00</td>
	            </tr>
	            <tr>
	              <td scope="row"><img src="imagens/produto.jpg" alt="Produto"></td>
	              <td>Exclusive Meinl Classics Custom Cymbal Set</td>
	              <td class="valor">R$1.999,00</td>
	            </tr>
	          </tbody>
	        </table>
	        <a href="carrinho" title="Ver e editar o carrinho de compras">Ver e editar o carrinho de compras</a><a href="carrinho-pagamento.html" class="botao direita" title="Fechar o pedido">Fechar o pedido <svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
	      </div>
	  -->
    </div>
    <!-- fecha navegações -->

    <form id="form_busca" action="#">
      <fieldset>
        <input type="search" name="busca" id="busca"><button id="busca" type="submit" ><svg width="25px" height="24px"><use xlink:href="#icone-busca" class="icone" /></svg></button>
      </fieldset>
    </form>
	
  </div>
  <!-- fecha .limites -->

</header>
<!-- fecha .topo -->

<script src="<?php echo URL; ?>bower_components/jquery/dist/jquery.min.js"></script>
<script src="<?php echo URL; ?>js/plugins.min.js" defer></script>
<script src="<?php echo URL; ?>js/main.min.js" defer></script>
<script type="text/javascript">

$(document).ready(function(){
	
	$("#form_busca").submit(function(){

		if($("#busca").val() != ""){
			
			$.ajax({
				type:'post',
				url:'<?php echo URL; ?>actions/funcoes.php',
				data:{
					funcao:'removerAcento',
					busca:$("#busca").val()
				},
				
				error: function(){
					alert('Erro ao tentar ação!');
				},
				
				success: function(busca){ 
					window.location.href = '<?php echo URL; ?>produtos/busca/' + busca;	
				}
			
			});
		
		}
		return false;

	});
	
});

</script>