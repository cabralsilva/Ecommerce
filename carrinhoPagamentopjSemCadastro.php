<?php
session_start ();

include ("class/constantes.php");
include ("actions/funcoes.php");
include ("actions/calcularFrete.php");

verificaSSL ( true );

$_tituloPagina = "Entrega e Pagamento - Carrinho de Compras";
$_carrinho = true;

if (isset ( $_SESSION ["PEDIDO"] ["USUARIO"] )) { // tudo se baseia nessa variável agora
	echo "<script> window.location.href='" . URL_SSL . "carrinhoLogin'; </script>";
	die ();
} else if (count ( @$_SESSION ["CART"] ) == 0) {
	echo "<script> alert('Carrinho vazio.'); </script>";
	echo "<script> parent.window.location.href='" . URL . "produtos'; </script>";
	die ();
}

?>
<!DOCTYPE html>
<!--[if IE 9]>         <html class="no-js lt-ie10"> <![endif]-->
<!--[if gt IE 9]><!--> 
<html class="no-js" lang="pt-br"> 
<!--<![endif]-->
<head>
  	<meta charset="utf-8" />
  	<title><?php if($_tituloPagina != "") echo $_tituloPagina; else echo $_tituloDescricao . " - " . TITLE; ?></title>
  	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
  	<link rel="icon" type="image/png" href="<?php echo URL_SSL; ?>imagens/favicon.png" />
  	<link href="humans.txt" rel="author" />
  	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic" rel="stylesheet">
  	<link href="painel/resources/css/_bower.css?v=1" rel="stylesheet" />
  	<link href="painel/resources/css/geral.css?v=1" rel="stylesheet" />
  	<link href="painel/resources/css/impressao.css?v=1" rel="stylesheet" media="print" />
  	<script src="painel/resources/bower_components/picturefill/dist/picturefill.min.js" async></script>
<!-- 	<script src="painel/resources/js/jquery-maskinput-1.1.4.js" defer></script> -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.10/jquery.mask.js" defer></script>
  	<!-- Smartsupp Live Chat script -->
	<script type="text/javascript">
		var _smartsupp = _smartsupp || {};
		_smartsupp.key = '38d1a11a2063d5c4308cff74ff4346c90bd2b515';
		window.smartsupp||(function(d) {
			var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
			s=d.getElementsByTagName('script')[0];c=d.createElement('script');
			c.type='text/javascript';c.charset='utf-8';c.async=true;
			c.src='//www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
		})(document);
	</script>
</head>
<body itemscope itemtype="http://schema.org/WebPage">

<!-- abre .carrinho -->
<div class="carrinho">

  <!-- abre .topo -->
  <header class="topo">

    <!-- abre .limites -->
    <div class="limites">
      <h1><a href="index.html" title="Voltar à página inicial"><img src="imagens/logo.png" alt="Plander.com"></a></h1>
      <ul class="contatos">
        <li><a href="#" title="Visitar o Atendimento Online"><svg width="23px" height="20px"><use xlink:href="#icone-atendimento" class="icone" /></svg> Atendimento Online</a></li>
        <li class="telefone"><strong><svg width="20px" height="20px"><use xlink:href="#icone-telefone" class="icone" /></svg> Televendas | (41) 3323-3636</strong></li>
        <li class="whatsapp"><strong><img src="imagens/icone-whatsapp.png" alt="WhatsApp"> (41) 9896-1818</strong></li>
      </ul>
    </div>
    <!-- fecha .limites -->

  </header>
  <!-- fecha .topo -->

  <!-- abre .conteudo -->
  <div class="conteudo">

    <!-- abre .limites -->
    <div class="limites">

      <header>
        <h2>Pagamento</h2>
        <ol class="passos">
          <li class="check"><svg width="24px" height="20px"><use xlink:href="#icone-carrinho" class="icone" /></svg> Carrinho</li>
<!--           <li class="check"><svg width="20px" height="20px"><use xlink:href="#icone-usuario" class="icone" /></svg> Identificação</li> -->
          <li class="ativo"><svg width="24px" height="20px"><use xlink:href="#icone-cartoes" class="icone" /></svg> Pagamento</li>
          <li><svg width="26px" height="20px"><use xlink:href="#icone-check" class="icone" /></svg> Confirmação</li>
        </ol>
      </header>

      <div class="resumo-pedido">
        <p>Informe abaixo os dados para contato e entrega do(s) seu(s) item(ns), em seguida informe a forma de pagamento</p>

        <ul class="abas">
          <li><a href="carrinhoPagamentoSemCadastro" title="Dados de pessoa física">Pessoa física</a></li>
          <li class="ativo"><a href="carrinhoPagamentopjSemCadastro" title="Dados de pessoa jurídica">Pessoa jurídica</a></li>
        </ul>

        <form action="<?php echo URL_SSL; ?>actions/finalizarPedidoSemCadastro.php" class="conta" method="POST" onsubmit="return mySubmit()">
			<input type="hidden" id="pessoa" name="pessoa" value="juridica">
          <fieldset>
            <section class="esquerda">
              <h3>Dados da empresa</h3>
              <ol>
                <li class="obrigatorio"><label for="razao-social">Razão social</label><input required="required" type="text" name="razao-social" id="razao-social"> <span>Por favor, preencha a razão social da empresa</span></li>
                <li>
                  <ul>
                    <li class="obrigatorio"><label for="cnpj">CNPJ</label><input required="required" class="medio" type="text" name="cnpj" id="cnpj"></li>
                    <li class="obrigatorio"><label for="ie">Inscrição Estadual</label><input required="required" class="medio" type="text" name="ie" id="ie"></li>
                  </ul>
                </li>
                <li class="obrigatorio"><label for="email">Endereço de e-mail</label><input required="required" class="medio" type="email" name="email" id="email"> <small>(será usado como usuário)</small></li>
                <li>
                  <ul>
                    <li class="obrigatorio"><label for="telefone">Telefone</label>
						<input required="required" class="cep" type="tel" name="ddd1"
						id="ddd1">
						<input required="required" class="medio" type="tel" name="telefone1"
						id="telefone1"></li>
					<li><label for="telefone2">Outro telefone</label>
						<input class="cep" type="tel" name="ddd2" id="ddd2">
						<input class="medio" type="tel" name="telefone2" id="telefone2"></li>
                  </ul>
                </li>
              </ol>
            </section>

            <section class="direita">
              <h3>Endereço de entrega</h3>
              <ol>
                <li class="obrigatorio">
                  <p title="Preencha seu CEP">CEP</p>
                  <ul>
                    <li><input required="required" class="cep medio" type="text" name="cep" id="cep" title="Digite o CEP"></li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li class="obrigatorio"><label for="endereco">Endereço</label><input required="required" class="grande" type="text" name="endereco" id="endereco"></li>
                    <li class="obrigatorio"><label for="endereco-numero">Número</label><input required="required" class="cep" type="text" name="endereco-numero" id="endereco-numero"></li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li><label for="complemento">Complemento</label><input class="medio" type="text" name="complemento" id="complemento"></li>
                    <li class="obrigatorio"><label for="bairro">Bairro</label><input required="required" class="medio" type="text" name="bairro" id="bairro"></li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li class="obrigatorio">
                      <label for="estado">Estado</label>
                      <div class="select medio">
                        <select required="required" name="estado" id="estado">
                          	<?php
								for($_i = 0; $_i < count ( $_arrayUf ); $_i ++) {
									echo "<option id=\"" . $_arrayUf [$_i] . "\" value=\"" . $_arrayUf [$_i] . "\" " . (($_uf == $_arrayUf [$_i] || ($_uf == "" && $_arrayUf [$_i] == "PR")) ? "selected=\"selected\"" : "") . ">" . $_arrayUf [$_i] . "</option>";
								}
							?>
                        </select>
                      </div>
                    </li>
                    <li class="obrigatorio"><label for="cidade">Cidade</label><input required="required" class="medio" type="text" name="cidade" id="cidade"></li>
                  </ul>
                </li>
                <li><label for="pontos">Pontos de referência</label><textarea name="pontos" id="pontos" cols="30" rows="10"></textarea></li>
              </ol>
            </section>
          </fieldset>
      
          <fieldset class="pedido">
            <h3>Meu pedido</h3>
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
					$_chaves = array_keys ( $_SESSION ["CART"] );
					$_subTotal = 0;
					$_transportadora = false;
					$_peso = 0;
					$_volume = 0;
					
					$_SESSION ["PEDIDO"] ["quantidade_parcelas_com_juros"] = 1;
					$_SESSION ["PEDIDO"] ["quantidade_parcelas_sem_juros"] = 1;
					
					for($_i = 0; $_i < count ( $_chaves ); $_i ++) {
						echo "<th scope=\"row\">";
						echo "<p>" . $_SESSION ["CART"] [$_chaves [$_i]] ["descricao"] . "</p>";
						echo "</th>";
						echo "<td>R$ " . number_format ( $_SESSION ["CART"] [$_chaves [$_i]] ["valor"], 2, ",", "." ) . "</td>";
						echo "<td>" . $_SESSION ["CART"] [$_chaves [$_i]] ["quantidade"] . "</td>";
						echo "<td>R$ " . number_format ( ($_SESSION ["CART"] [$_chaves [$_i]] ["valor"] * $_SESSION ["CART"] [$_chaves [$_i]] ["quantidade"]), 2, ",", "." ) . "</td>";
						echo "</tr>";
						
						$_subTotal += ($_SESSION ["CART"] [$_chaves [$_i]] ["valor"] * $_SESSION ["CART"] [$_chaves [$_i]] ["quantidade"]);
						
						$_transportadora = $_SESSION ["CART"] [$_chaves [$_i]] ["transportadora"] == "Transportadora" ? true : $_transportadora;
						$_peso += ($_SESSION ["CART"] [$_chaves [$_i]] ["quantidade"] * $_SESSION ["CART"] [$_chaves [$_i]] ["peso"]);
						$_volume += ($_SESSION ["CART"] [$_chaves [$_i]] ["altura"] * $_SESSION ["CART"] [$_chaves [$_i]] ["largura"] * $_SESSION ["CART"] [$_chaves [$_i]] ["comprimento"] * $_SESSION ["CART"] [$_chaves [$_i]] ["quantidade"]);
						
						$_SESSION ["PEDIDO"] ["quantidade_parcelas_com_juros"] = max ( $_SESSION ["CART"] [$_chaves [$_i]] ["quant_parcelas_com_juros"], $_SESSION ["PEDIDO"] ["quantidade_parcelas_com_juros"] );
						$_SESSION ["PEDIDO"] ["quantidade_parcelas_sem_juros"] = max ( $_SESSION ["CART"] [$_chaves [$_i]] ["quant_parcelas_sem_juros"], $_SESSION ["PEDIDO"] ["quantidade_parcelas_sem_juros"] );
					}
					
					$_SESSION ["PEDIDO"] ["subtotal"] = $_subTotal;
					
					// *****************************************************************
					// calcula frete
					
					$_arrayFrete = array ();
					$_erroFrete = false;
					$_calculaFrete = false;
					$_SESSION ["PEDIDO"] ["valor_frete"] = 0;
					
					if ($_transportadora == false) {
						$_raizCubica = round ( pow ( $_volume, 1 / 3 ), 2 );
						$_altura = $_raizCubica;
						$_largura = $_raizCubica;
						$_comprimento = $_raizCubica;
						
						for($_divisor = 1; $_peso > 30 or $_altura > 105 or $_largura > 105 or $_comprimento > 105 or ($_altura + $_largura + $_comprimento) > 200;) {
							$_divisor = $_divisor + 1;
							
							$_peso = round ( ($_peso / $_divisor), 2 );
							$_volume = $_volume / $_divisor;
							$_raizCubica = round ( pow ( $_volume, 1 / 3 ) );
							$_altura = $_raizCubica;
							$_largura = $_raizCubica;
							$_comprimento = $_raizCubica;
						}
					}
				?>
              </tbody>
            </table>

            <table>
              <tfoot>
                <tr>
					<th scope="row">Subtotal</th>
					<td class="td_subtotal">R$ <?php echo number_format($_SESSION["PEDIDO"]["subtotal"],2,",","."); ?></td>
				</tr>
				<tr>
					<th scope="row">Frete</th>
					<td class="td_frete">R$ <?php echo number_format($_SESSION["PEDIDO"]["valor_frete"],2,",","."); ?></td>
				</tr>
				<tr>
					<th scope="row">Total</th>
					<td class="td_total">R$ <?php echo number_format($_SESSION["PEDIDO"]["subtotal"]+$_SESSION["PEDIDO"]["valor_frete"],2,",","."); ?></td>
				</tr>
              </tfoot>
            </table>
            <a href="<?= URL_SSL ?>carrinho" class="voltar" title="Editar carrinho"><svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg> Editar carrinho</a>
          </fieldset>

          <fieldset class="opcoes-entrega">
            <h3>Opções de entrega</h3>
            <ul id="opcoes-entrega">
              Entre com o seu CEP no endereço de entrega
            </ul>
          </fieldset>
          <fieldset class="formas">
            <h3>Formas de pagamento</h3>
            <ul>
	            <li><label><input id="radio_master" type="radio" name="pagamento" checked="checked" value="0"><img
						src="imagens/pagamento-master.png" alt="MasterCard"></label></li>
				<li><label><input id="radio_visa" type="radio" name="pagamento" value="1"><img
						src="imagens/pagamento-visa.png" alt="Visa"></label></li>
				<li><label><input id="radio_boleto" type="radio" name="pagamento" value="2"><img
						src="imagens/pagamento-boleto.png" alt="Boleto"></label></li>
            </ul>
          </fieldset>
          <fieldset class="pagamento">
            <ol>
              	<li class="obrigatorio">
					<ul>
						<li><label for="numero-cartao">Número do cartão &nbsp;&nbsp;&nbsp;(somente números)</label><input
							class="grande" type="text" name="numero-cartao"
							id="numero-cartao" maxlength="16"></li>
						<li><label for="codigo-cartao">Código de segurança</label><input
							class="pequeno" type="text" name="codigo-cartao"
							id="codigo-cartao" maxlength="3"></li>
					</ul>
				</li>
	<!-- 								<li class="obrigatorio"><label for="documento">CPF / CNPJ do -->
	<!-- 										titular do cartão</label><input class="grande" type="text" -->
	<!-- 									name="documento" id="documento"></li> -->
				<li class="obrigatorio"><label for="nome-impresso">Nome impresso
						no cartão</label><input class="grande" type="text"
					name="nome-impresso" id="nome-impresso"></li>
				<li class="obrigatorio">
					<p title="Selecione o mês e ano de validade do cartão">Validade</p>
					<ul>
						<li>
							<div class="select pequeno">
								<select name="mes-cartao">
									<option>Mês</option>
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
									<option>6</option>
									<option>7</option>
									<option>8</option>
									<option>9</option>
									<option>10</option>
									<option>11</option>
									<option>12</option>
								</select>
							</div>
						</li>
						<li>
							<div class="select pequeno">
								<select name="ano-cartao">
									<option>Ano</option>
										<?php
					                      	$_ano = date("Y");
											for ($_i=0; $_i < 12; $_i++)
												echo "<option value=\"" . ($_ano+$_i) . "\">" . ($_ano+$_i) . "</option>";
				                      	?>
								</select>
							</div>
						</li>
					</ul>
				</li>
				<li class="obrigatorio"><label for="parcelamento">Parcelamento</label>
					<div class="select select_parcelas">
						<select name="parcelamento" id="parcelamento">
							<?php
				          		$_juros[true] = "sem juros";
				                $_juros[false] = "com juros";
								
								$_SESSION["PEDIDO"]["valor_total"] = $_SESSION["PEDIDO"]["subtotal"]+$_SESSION["PEDIDO"]["valor_frete"];
								
				               	for($_i=0; $_i<$_SESSION["PEDIDO"]["quantidade_parcelas_com_juros"]; $_i++) {
				                	echo "<option value=\"" . ($_i+1) . "\">";
				                	echo ($_i+1) . "x " . $_juros[$_i<$_SESSION["PEDIDO"]["quantidade_parcelas_sem_juros"]] . " de";
									echo " <span>";
									
									if($_i<$_SESSION["PEDIDO"]["quantidade_parcelas_sem_juros"])
				                		echo "R$ " . number_format($_SESSION["PEDIDO"]["valor_total"] / ($_i+1), 2, ",", ".");
									else
										echo "R$ " . number_format(pmt(JUROS,($_i+1),$_SESSION["PEDIDO"]["valor_total"]), 2, ",", ".");
									
									echo "</span>";
									echo "</option>";
								}
				          	?>
						</select>
					</div>
				</li>
			
            </ol>
            <button class="action" title="Confirmar compra">Confirmar <svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg></a>
            <!-- <p>Boleto no valor de <strong>R$999,00</strong>, com vencimento para o dia <strong>30/12/2015</strong>.</p> -->
          </fieldset>
        </form>
      </div>

    </div>
    <!-- fecha .limites -->

  </div>
  <!-- fecha .conteudo -->

  <!-- abre .rodape -->
  <footer class="rodape">

    <!-- abre .limites -->
    <div class="limites">
      <div>
        <h4>Segurança</h4>
        <ul class="seguranca centro">
          <li><img src="imagens/seguranca-ssl.jpg" alt="Secured by RapidSSL"></li>
          <li><img src="imagens/seguranca-correios.jpg" alt="Entrega garantida Correios"></li>
          <li><img src="imagens/seguranca-ebit.jpg" alt="ebit"></li>
        </ul>
      </div>
      <div>
        <h4>Formas de Pagamento</h4>
        <ul class="pagamento centro">
          <li><img src="imagens/pagamento-master.png" alt="MasterCard"></li>
          <li><img src="imagens/pagamento-visa.png" alt="Visa"></li>
          <li><img src="imagens/pagamento-boleto.png" alt="Boleto"></li>
        </ul>
        <small>Outros cartões consulte equipe</small>
      </div>
    </div>
    <!-- fecha .limites -->

    <p class="copyright centro">&copy; 2015 Plander.com – Todos os direitos reservados <span>| CNPJ: 12345678/1234-12 |</span> Rua Alferes Poli, 620 - Centro - Curitiba, PR</p>

  </footer>
  <!-- fecha .rodape -->

</div>
<!-- fecha .carrinho -->

<!-- abre ícones SVG -->
<svg style="display: none;"><symbol viewBox="0 0 49 46" id="icone-alerta"><title>Shape</title><g id="alerta-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="alerta-Produto" transform="translate(-999 -482)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="alerta-detalhes" transform="translate(28 374)" sketch:type="MSLayerGroup"> <g id="alerta-indispon&#xED;vel" sketch:type="MSShapeGroup" transform="translate(971 108.5)"> <g id="alerta-triangle38"> <g id="alerta-Group"> <path id="alerta-Shape" d="m47.879 40.902l-21.04-39.303c-0.524-0.9823-1.552-1.599-2.671-1.599h-0.003c-1.119 0-2.144 0.61372-2.672 1.5963l-21.134 39.303c-0.50293 0.943-0.4757 2.074 0.07017 2.981 0.54886 0.91 1.5375 1.469 2.6019 1.469h42.17c1.068 0 2.053-0.556 2.602-1.469 0.549-0.91 0.577-2.041 0.076-2.978zm-23.714-1.599c-1.674 0-3.033-1.355-3.033-3.024 0-1.668 1.359-3.023 3.033-3.023 1.671 0 3.032 1.355 3.032 3.023 0 1.669-1.358 3.024-3.032 3.024zm3.035-12.045c0 1.672-1.361 3.023-3.032 3.023-1.674 0-3.033-1.351-3.033-3.023v-12.093c0-1.669 1.359-3.024 3.033-3.024 1.671 0 3.032 1.355 3.032 3.024v12.093z"/> </g> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 23 21" id="icone-atendimento"><title>Shape</title><g id="atendimento-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="atendimento-P&#xE1;gina-Inicial" transform="translate(-589 -28)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="atendimento-topo" sketch:type="MSLayerGroup"> <g id="atendimento-nav" sketch:type="MSShapeGroup" transform="translate(28 25)"> <g id="atendimento-atendimento" transform="translate(561.5 3.1855)"> <g id="atendimento-Group"> <path id="atendimento-Shape" d="m15.675 0.014366c-2.713 0-5.052 1.4318-6.0886 3.48-0.2021-0.0291-0.4003-0.0349-0.5236-0.0349-0.448 0-1.6156 0.0785-2.7824 0.8054-0.6406 0.399-0.9399 0.9663-0.9708 1.8391-0.0001 0.0027-0.0001 0.0052-0.0001 0.008h0.0022l-0.0013 1.4644-0.0005 0.0002c-0.0104 0.003-0.0206 0.0068-0.0303 0.0111-0.1519 0.0684-0.2314 0.0376-0.2503 0.3566-0.0215 0.3634 0.0417 1.3235 0.4338 1.563 0.0586 0.0603 0.0973 0.2248 0.1205 0.4079 0.0435 0.3428 0.0926 0.7308 0.2859 0.9848 0.44 0.579 0.3244 1.475 0.3146 1.544-0.0015 0.001-0.0036 0.002-0.0065 0.004-0.2711 0.122-0.3423 0.359-0.3944 0.532l-0.0266 0.086c-0.0702 0.226-0.1366 0.44-0.228 0.643-0.0123 0.018-0.0653 0.06-0.134 0.086l-0.2003 0.076c-1.2665 0.486-2.576 0.988-3.7922 1.66-1.1497 0.636-1.3914 4.077-1.4012 4.186-0.0058296 0.066 0.016189 0.131 0.060649 0.18 0.044461 0.048 0.10728 0.076 0.17319 0.076h8.3884 8.3879c0.066 0 0.129-0.028 0.174-0.076 0.044-0.049 0.066-0.114 0.06-0.18-0.01-0.109-0.251-3.55-1.401-4.186-1.216-0.672-2.526-1.174-3.792-1.66l-0.2-0.076c-0.069-0.027-0.122-0.068-0.134-0.086-0.092-0.203-0.158-0.417-0.228-0.643l-0.027-0.086c-0.052-0.173-0.123-0.41-0.394-0.532-0.003-0.002-0.005-0.003-0.007-0.004-0.01-0.069-0.125-0.965 0.315-1.544 0.092-0.121 0.151-0.273 0.193-0.435 0.902 0.622 1.993 1.045 3.189 1.189v2.148c0 0.227 0.138 0.431 0.349 0.515 0.067 0.026 0.136 0.039 0.205 0.039 0.15 0 0.296-0.06 0.403-0.173l2.915-3.08c1.069-0.464 1.976-1.1724 2.628-2.0526 0.704-0.9484 1.076-2.0511 1.076-3.1887 0-3.2242-2.988-5.8473-6.66-5.8473v-0.000034zm2.421 10.113c-0.072 0.029-0.137 0.074-0.19 0.131l-2.038 2.152v-1.265c0-0.295-0.232-0.538-0.526-0.553-1.314-0.067-2.5-0.523-3.408-1.2312 0.258-0.36 0.301-1.106 0.283-1.4165-0.019-0.3191-0.099-0.2883-0.25-0.3566-0.01-0.0044-0.02-0.0082-0.031-0.0112v-0.0001-1.4642c-0.001-0.7452-0.181-1.2464-0.553-1.5322-0.164-0.1266-0.353-0.245-0.535-0.3596-0.1-0.0628-0.202-0.1265-0.293-0.1885 0.84-1.7072 2.819-2.9091 5.12-2.9091 3.061 0 5.551 2.1258 5.551 4.7388 0 1.8017-1.228 3.4758-3.13 4.2654z"/> </g> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 24 24" id="icone-busca"><title>lupa</title><g id="busca-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="busca-P&#xE1;gina-Inicial" transform="translate(-926 -139)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="busca-topo" sketch:type="MSLayerGroup"> <g id="busca-busca" sketch:type="MSShapeGroup" transform="translate(388 128)"> <g id="busca-lupa" transform="translate(538 11)"> <g id="busca-Group" transform="translate(.000626)"> <path id="busca-Shape" d="m22.954 20.127l-5.414-5.498c-0.807 1.274-1.875 2.358-3.13 3.177l5.416 5.497c0.864 0.878 2.266 0.878 3.128 0 0.865-0.876 0.865-2.299 0-3.176z"/> <path id="busca-Shape" d="m17.702 8.9854c0-4.962-3.963-8.9854-8.8508-8.9854-4.8879 0-8.8512 4.0234-8.8512 8.9854 0.000048645 4.9626 3.9633 8.9856 8.8512 8.9856 4.8878 0 8.8508-4.023 8.8508-8.9856zm-8.8508 6.7386c-3.6606 0-6.6383-3.022-6.6383-6.7385 0-3.7162 2.9777-6.739 6.6383-6.739 3.6608 0 6.6388 3.0228 6.6388 6.739 0 3.7165-2.978 6.7385-6.6388 6.7385z"/> <path id="busca-Shape" d="m3.6881 8.9854h1.475c0-2.0643 1.6546-3.7439 3.688-3.7439v-1.4975c-2.8465 0-5.163 2.3517-5.163 5.2414z"/> </g> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 24 20" id="icone-carrinho"><title>carrinho</title><g id="carrinho-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="carrinho-P&#xE1;gina-Inicial" transform="translate(-1170 -142)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="carrinho-topo" sketch:type="MSLayerGroup"> <g id="carrinho-compras" sketch:type="MSShapeGroup" transform="translate(1161 135)"> <g id="carrinho-carrinho" transform="translate(9 7)"> <path id="carrinho-Shape" d="m20.311 13.105l2.732-8.3042c0.137-0.3993 0.033-0.6393-0.077-0.7977-0.284-0.4054-0.866-0.4093-0.979-0.4093l-15.439-0.003-0.4118-1.9854c-0.1114-0.4685-0.4401-0.9154-1.1028-0.9154h-4.3389c-0.44987 0-0.6945 0.21385-0.6945 0.6408v1.1461c0 0.4131 0.24387 0.5208 0.71041 0.5208h3.6634l2.8037 12.09c-0.4453 0.479-0.6877 1.177-0.6877 1.829 0 1.434 1.124 2.755 2.5599 2.755 1.3553 0 2.3723-1.29 2.5373-2.059h5.46c0.166 0.769 0.989 2.09 2.537 2.09 1.411 0 2.558-1.241 2.558-2.673 0-1.424-0.852-2.686-2.544-2.686-0.703 0-1.538 0.384-1.926 0.961h-6.709c-0.487-0.769-1.1521-1.007-1.8247-1.034l-0.0931-0.504h10.209c0.769 0 0.921-0.285 1.057-0.662zm-0.708 2.917c0.531 0 0.962 0.437 0.962 0.976 0 0.54-0.431 0.977-0.962 0.977s-0.963-0.437-0.963-0.977c0.001-0.539 0.432-0.976 0.963-0.976zm-9.602 0.976c0 0.546-0.4363 0.99-0.9717 0.99-0.537-0.002-0.974-0.444-0.974-0.99 0-0.545 0.437-0.989 0.974-0.989 0.5354 0 0.9717 0.444 0.9717 0.989z"/> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 24 20" id="icone-cartoes"><title>credit2</title><g id="cartoes-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="cartoes-Carrinho" transform="translate(-1069 -110)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="cartoes-carrinho" transform="translate(30 110)" sketch:type="MSLayerGroup"> <g id="cartoes-passos" sketch:type="MSShapeGroup" transform="translate(777)"> <g id="cartoes-credit2-+-Pagamento" transform="translate(242)"> <g id="cartoes-credit2" transform="translate(20)"> <g id="cartoes-Group"> <path id="cartoes-Shape" d="m2.6628 8.8842c0-0.9626 0.7756-1.7456 1.729-1.7456h16.741l-1.981-6.3317c-0.185-0.5885-0.81-0.91767-1.396-0.73064l-16.955 5.4114c-0.58582 0.1871-0.90938 0.818-0.72414 1.409l2.5884 8.2643v-6.2768h-0.0025z"/> <path id="cartoes-Shape" d="m3.4038 18.999c0 0.551 0.4421 0.997 0.988 0.997h18.03c0.546 0 0.988-0.446 0.988-0.997v-1.347h-20.006l-0.0002 1.347z"/> <path id="cartoes-Shape" d="m23.41 8.8842c0-0.5511-0.442-0.9975-0.988-0.9975h-1.055-16.975c-0.5461 0-0.9882 0.4464-0.9882 0.9975v6.8958h4.9324 15.074v-6.8958z"/> </g> </g> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 26 20" id="icone-check"><title>checked21</title><g id="check-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="check-Carrinho" transform="translate(-1201 -110)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="check-carrinho" transform="translate(30 110)" sketch:type="MSLayerGroup"> <g id="check-passos" sketch:type="MSShapeGroup" transform="translate(777)"> <g id="check-checked21-+-Confirma&#xE7;&#xE3;o-da-compr" transform="translate(371)"> <g id="check-checked21" transform="translate(23)"> <path id="check-Shape" d="m25.129 3.1647l-2.829-2.8505c-0.335-0.33734-0.878-0.33734-1.212 0.00002l-11.784 11.874-5.0118-5.0499c-0.3347-0.3374-0.8776-0.3374-1.2123 0l-2.8288 2.8505c-0.33477 0.3374-0.33477 0.8844 0.00002 1.2214l8.4468 8.512c0.1674 0.168 0.3868 0.253 0.6062 0.253s0.4388-0.085 0.6061-0.253l15.219-15.336c0.161-0.1617 0.251-0.3814 0.251-0.6105 0-0.2292-0.09-0.4488-0.251-0.6108z"/> </g> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 371.23 371.23" id="icone-close"><title>close</title> <polygon points="371.23,21.213 350.018,0 185.615,164.402 21.213,0 0,21.213 164.402,185.615 0,350.018 21.213,371.23 
  185.615,206.828 350.018,371.23 371.23,350.018 206.828,185.615 "/>                </symbol><symbol viewBox="0 0 23 16" id="icone-frete"><title>truck</title><g id="frete-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="frete-P&#xE1;gina-Inicial" transform="translate(-156 -1209)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="frete-galeria-produtos" transform="translate(34 816)" sketch:type="MSLayerGroup"> <g id="frete-produto" sketch:type="MSShapeGroup"> <g id="frete-selo-frete" transform="translate(122 392)"> <g id="frete-truck" transform="translate(0 1)"> <path id="frete-Shape" d="m0.78598 10.649v-9.6439c0-0.53588 0.42932-0.97032 0.95892-0.97032l9.5251-0.000002c0.53 0 0.959 0.43444 0.959 0.97032v9.6439c0 0.179-0.143 0.323-0.319 0.323h-10.804c-0.17695 0-0.32002-0.144-0.32002-0.323zm7.6921 3.304c0 1.111-0.8905 2.012-1.9888 2.012-1.0984 0-1.9889-0.901-1.9889-2.012 0-1.112 0.8905-2.013 1.9889-2.013 1.0983 0 1.9888 0.901 1.9888 2.013zm-0.9945 0c0-0.556-0.4452-1.007-0.9944-1.007s-0.9944 0.451-0.9944 1.007c0 0.555 0.4452 1.006 0.9944 1.006s0.9944-0.451 0.9944-1.006zm-2.7073-2.013h-4.4567c-0.17649 0-0.3196 0.145-0.3196 0.324v0.981c0 0.179 0.14311 0.323 0.31964 0.323h3.5723c0.0932-0.647 0.4162-1.219 0.8844-1.628zm14.108 2.013c0 1.111-0.89 2.012-1.989 2.012-1.098 0-1.989-0.901-1.989-2.012 0-1.112 0.891-2.013 1.989-2.013 1.099 0 1.989 0.901 1.989 2.013zm-0.994 0c0-0.556-0.446-1.007-0.995-1.007s-0.994 0.451-0.994 1.007c0 0.555 0.445 1.006 0.994 1.006s0.995-0.451 0.995-1.006zm4.51-1.689v0.981c0 0.179-0.143 0.323-0.32 0.323h-2.587c-0.186-1.284-1.278-2.275-2.598-2.275s-2.412 0.991-2.597 2.275h-5.2113c-0.0933-0.647-0.4163-1.219-0.8845-1.628h4.9408v-9.2513c0-0.3573 0.286-0.6469 0.639-0.6469h3.018c0.85 0 1.644 0.4271 2.119 1.1396l1.946 2.9156c0.285 0.4277 0.437 0.9319 0.437 1.4479v4.3951h0.778c0.177 0 0.32 0.145 0.32 0.324zm-3.243-6.0923l-1.555-2.2368c-0.06-0.0861-0.158-0.1373-0.262-0.1373h-2.426c-0.177 0-0.32 0.1448-0.32 0.3234v2.2368c0 0.1787 0.143 0.3235 0.32 0.3235h3.982c0.259 0 0.41-0.2953 0.261-0.5096z"/> </g> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 24 17" id="icone-mail"><title>Group</title><g id="mail-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="mail-Produto" transform="translate(-1034 -625)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="mail-detalhes" transform="translate(28 374)" sketch:type="MSLayerGroup"> <g id="mail-mail" sketch:type="MSShapeGroup" transform="translate(1006 251)"> <g id="mail-Group"> <path id="mail-Shape" d="m12 11.9l-2.9691-2.5772-8.4892 7.2162c0.30859 0.284 0.7252 0.461 1.1846 0.461h20.548c0.457 0 0.872-0.177 1.179-0.461l-8.484-7.2162-2.969 2.5772z"/> <path id="mail-Shape" d="m23.458 0.4607c-0.308-0.2856-0.723-0.4607-1.184-0.4607h-20.548c-0.4574 0-0.87229 0.1768-1.1809 0.4641l11.455 9.7359 11.458-9.7393z"/> <path id="mail-Shape" d="m0 1.4926v14.123l8.2851-6.9817-8.2851-7.1417z"/> <path id="mail-Shape" d="m15.715 8.6343l8.285 6.9817v-14.128l-8.285 7.1463z"/> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 9 6" id="icone-seta-baixo"><title>Triangle 1 Copy</title><g id="seta-baixo-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="seta-baixo-P&#xE1;gina-Inicial" transform="translate(-1098 -160)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="seta-baixo-topo" sketch:type="MSLayerGroup"> <g id="seta-baixo-Triangle-1-Copy-+-Ol&#xE1;-Gustavo." sketch:type="MSShapeGroup" transform="translate(1004 129.5)"> <path id="seta-baixo-Triangle-1-Copy" d="m94 31h9l-4.5 5.255-4.5-5.255z"/> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 11 20" id="icone-seta"><title>Shape</title><g id="seta-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="seta-P&#xE1;gina-Inicial" transform="translate(-32 -712)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="seta-marcas" transform="translate(32 698)" sketch:type="MSLayerGroup"> <g id="seta-arrow395" sketch:type="MSShapeGroup" transform="translate(0 14)"> <path id="seta-Shape" d="m10.241 19.876l-10.196-9.9383 10.196-9.9377 0.528 0.54553-9.6347 9.3922 9.6347 9.3923-0.528 0.546z"/> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 21 21" id="icone-telefone"><title>Shape</title><g id="telefone-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="telefone-P&#xE1;gina-Inicial" transform="translate(-785 -28)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="telefone-topo" sketch:type="MSLayerGroup"> <g id="telefone-nav" sketch:type="MSShapeGroup" transform="translate(28 25)"> <g id="telefone-telefone" transform="translate(757.5 3.1855)"> <path id="telefone-Shape" d="m19.501 15.809l-3.071-3.089c-0.612-0.613-1.625-0.595-2.259 0.042l-1.547 1.557c-0.098-0.055-0.199-0.111-0.305-0.171-0.978-0.545-2.315-1.291-3.7228-2.708-1.4116-1.42-2.1545-2.7669-2.6976-3.7504-0.0573-0.1042-0.1123-0.2047-0.1665-0.3001l1.0386-1.043 0.5107-0.5142c0.6341-0.6379 0.6516-1.6567 0.0412-2.2713l-3.0717-3.0901c-0.6104-0.61377-1.6241-0.59515-2.2582 0.04278l-0.8657 0.87572 0.0236 0.0236c-0.29026 0.3725-0.53283 0.8022-0.71334 1.2655-0.1664 0.441-0.27 0.8619-0.31737 1.2836-0.4056 3.3819 1.131 6.4729 5.301 10.667 5.7641 5.797 10.409 5.359 10.61 5.337 0.436-0.052 0.855-0.157 1.28-0.323 0.456-0.179 0.883-0.423 1.253-0.714l0.019 0.017 0.877-0.864c0.633-0.638 0.651-1.657 0.041-2.273z"/> </g> </g> </g> </g> </g> </symbol><symbol viewBox="0 0 20 20" id="icone-usuario"><title>user168</title><g id="usuario-Desktop" fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g id="usuario-Carrinho" transform="translate(-943 -110)" fill="currentColor" sketch:type="MSArtboardGroup"> <g id="usuario-carrinho" transform="translate(30 110)" sketch:type="MSLayerGroup"> <g id="usuario-passos" sketch:type="MSShapeGroup" transform="translate(777)"> <g id="usuario-user168-+-Identifica&#xE7;&#xE3;o" transform="translate(110)"> <g id="usuario-user168" transform="translate(26)"> <g id="usuario-Group"> <path id="usuario-Shape" d="m10.004 10.598c2.465 0 4.464-2.3623 4.464-5.2765 0-4.0411-1.998-5.2765-4.464-5.2765-2.4656 0.000012-4.4642 1.2354-4.4642 5.2765 0.0001 2.9142 1.9987 5.2765 4.4642 5.2765z"/> <path id="usuario-Shape" d="m19.862 18.364l-2.252-5.123c-0.103-0.234-0.284-0.429-0.51-0.547l-3.495-1.838c-0.077-0.04-0.17-0.032-0.24 0.021-0.988 0.755-2.151 1.154-3.361 1.154-1.2105 0-2.3728-0.399-3.3614-1.154-0.0695-0.053-0.1628-0.061-0.2399-0.021l-3.4952 1.838c-0.2253 0.118-0.4061 0.312-0.5092 0.547l-2.2523 5.123c-0.15525 0.354-0.12342 0.758 0.08519 1.082 0.20852 0.324 0.56141 0.517 0.94401 0.517h17.658c0.382 0 0.735-0.193 0.944-0.517 0.208-0.324 0.24-0.728 0.085-1.082z"/> </g> </g> </g> </g> </g> </g> </g> </symbol></svg>
<!-- fecha ícones SVG -->

<!-- abre scripts -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="js/plugins.min.js"></script>
<script src="js/_bower.min.js"></script>
<script src="js/main.min.js" defer></script>
<!-- fecha scripts -->
	<script type="text/javascript">
	$('#radio_visa, #radio_master').click(function(){
		$('fieldset.pagamento ol').slideDown();
	});
	
	$('#radio_boleto').click(function(){		
		$('fieldset.pagamento ol').slideUp();
	});
	function alterFrete(elem){
		//if ($(this).val()!="2"){ //nao fazer nd quando transportadora
		
			var dados = {"tipo":elem.value};
			$.ajax({
				url: "actions/alterarFretePagamento.php",
				data: dados,
				headers: {
					   'Access-Control-Allow-Origin' : '<?= URL_SSL ?>',
					   },
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				
				success: function(frete){
					console.log(frete);
					$(".td_frete").html(frete[0]);
					$(".td_total").html(frete[1]);
					$(".select_parcelas").html(frete[2]);
				}
			});
		//}
	}
	function mySubmit(){
		if ($('input[name=pagamento]:checked').val()!="2"){ //não é boleto
			var numCartao = $("input[name=numero-cartao]").val().replace(/[^0-9]+/g,'');
			
			if (numCartao.length!=16){
				alert("O número do cartão deve conter 16 caracteres!");
				$('input[name=numero-cartao]').focus();
				
				return false;
			}else if ($('input[name=codigo-cartao]').val().length!=3){
				alert("Código de seguração deve conter 3 caracteres!");
				alert($('input[name=codigo-cartao]').length);
				$('input[name=codigo-cartao]').focus();
				
				return false;
			//}else if ($('input[name=documento]').val()==""){
			//	alert("Preencha todos os campos para prosseguir");
			//	$('input[name=documento]').focus();
			//	
			//	return false;
			}else if ($('input[name=nome-impresso]').val()==""){
				alert("Informe o nome impresso no cartão!");
				$('input[name=nome-impresso]').focus();
				
				return false;
			}else if ($('select[name=mes-cartao]').val()=="0"){
				alert("Informe o mês de validade do cartão!");
				$('select[name=mes-cartao]').focus();
				
				return false;
			}else if ($('select[name=ano-cartao]').val()=="0"){
				alert("Informe o ano de validade do cartão!");
				$('select[name=ano-cartao]').focus();
				
				return false;
			}
		}
			
		<?php
			if ($_erroFrete==false)
				echo "return true;";
			else
				echo "return false;";
		?>
	}
$(document).ready(function(){
	$("#cep").mask("99.999-999", {placeholder: "__.___-___"});
	$("#cpf").mask("999.999.999-99", {placeholder: "___.___.___-__"});
	$("#cnpj").mask("99.999.999/9999-99", {placeholder: "__.___.___/____-__"});
	$("#ddd1").mask("(99)", {placeholder: "__"});
	$("#ddd2").mask("(99)", {placeholder: "__"});
	function optionMaskPhone(elem){
		var opt = {
			translation:  {
				'Z': {
					pattern: /[0-9]/, 
					optional: true	
				}
			},
			placeholder: "x_____-____",
			onKeyPress: function(input, e, field, options){
				console.log("Digitou: " + input.length);
				var masks = ['0000-0000Z', '90000-0000'];
				mask = masks[0];
				if (input.length > 9) mask = masks[1];
				$(elem).mask(mask, options);
			}
		};
		return opt;
	}
	$('#telefone1').mask('0000-0000Z', optionMaskPhone("#telefone1"));
	$('#telefone2').mask('0000-0000Z', optionMaskPhone("#telefone2"));
	$("#cep").keyup(function(e) {
		var valor = $("#cep").val().replace(/[^0-9]+/g,'');
		if (valor.length == 8){
			var dados = {'cep1':valor.slice(0,5), 'cep2':valor.slice(5)};
// 			$.ajax({
// 				data: dados,
				
// 				success: function(cep){
// 					var cidade = $(cep).find('cidade').text();
// 					var uf = $(cep).find('uf').text();
// 					var endereco = $(cep).find('tipo').text() + " " + $(cep).find('logradouro').text();
// 					var bairro = $(cep).find('bairro').text();
					
// 					$('input[name=cidade]').val(cidade);
// 					$("select option").removeAttr("selected");
					
// 					document.getElementById(uf).selected = true;
					
// 					$('input[name=endereco]').val(endereco);
// 					$('input[name=bairro]').val(bairro);
					
// 					$('input[name=endereco-numero]').focus();
// 				}
// 			});


			
			var dados = {'cep1':valor.slice(0,5), 'cep2':valor.slice(5)};
			$.ajax({
				url: "actions/inputCepXml.php",
				data: dados,
				success: function(cep){
					$('input[name=cidade]').val($(cep).find('cidade').text());
					$("select option").removeAttr("selected");
					document.getElementById($(cep).find('uf').text()).selected = true;
					$('input[name=endereco]').val($(cep).find('tipo').text() + " " + $(cep).find('logradouro').text());
					$('input[name=bairro]').val($(cep).find('bairro').text());
					$('input[name=endereco-numero]').focus();
					<?php if (!$_transportadora) {?>
						$.ajax({
							type: "GET",
							url: "actions/calcularFreteSemCadastro.php?tipo=0&cep=" + valor + "&peso=<?= $_peso ?>&altura=<?= $_altura?>&largura=<?=$_largura?>&comprimento=<?=$_comprimento?>",
							success: function (retorno){
								var jsonObject = JSON.parse(retorno);
								var html = "<li><label><input type='radio' name='entrega' value='0' checked='checked' onclick='alterFrete(this)'>" +
									"<img src='imagens/carrinho-pac.png' alt='PAC'>" +
											jsonObject.prazo_pac + " dias úteis <span>R$ " + jsonObject.valor_pac + "</span>" +
					          		"</label></li>";
	
				          		html += "<li><label><input type='radio' name='entrega' value='1' onclick='alterFrete(this)'>" +
									"<img src='imagens/carrinho-sedex.png' alt='SEDEX'>" +
											jsonObject.prazo_sedex + " dias úteis <span>R$ " + jsonObject.valor_sedex + "</span>" +
					          		"</label></li>";
					          		
								$("#opcoes-entrega").html(html);	
								
								var s = document.getElementsByName("entrega");
								alterFrete(s[0]);
							}
						});
					<?php }else{?>
						var html = "<li><label><input type='radio' name='entrega' value='2' checked='checked'>" +
							"<img src='imagens/carrinho-transportadora.png' alt='Transportadora'></label></li>";
						$("#opcoes-entrega").html(html);
					<?php }?>
					
				}
			});
			
		}

		
	});	
})


</script>

</body>
</html>
