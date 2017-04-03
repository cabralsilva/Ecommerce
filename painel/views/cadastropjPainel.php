<?php
include '../util/constantes.php';
date_default_timezone_set ( 'America/Sao_Paulo' );
session_start ();
if (! isset ( $_SESSION ["PEDIDO"]["USUARIO"] )) { // verifica se está logado
	header ( "Location: " . BasePainel . "/loginPainel" );
	die ();
}else if ( isset ( $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] ) && $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] == "fisica"){
	header ( "Location: " . BasePainel . "/editarpf" );
	die ();
}

$_REQUEST["page"] = "cadastroPainel";
?>

<!DOCTYPE html>
<!--[if IE 9]>         <html class="no-js lt-ie10"> <![endif]-->
<!--[if gt IE 9]><!-->
<html class="no-js" lang="pt-br">
<!--<![endif]-->
<head>
<meta charset="utf-8" />
<title>Cadastro - Painel do Usuário</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<?php include 'head.php';?>

</head>
<body itemscope itemtype="http://schema.org/WebPage">

	<!-- abre .carrinho.painel -->
	<div class="carrinho painel">

		<?php include 'header.php';?>

		<!-- abre .conteudo -->
		<div class="conteudo">

			<!-- abre .limites -->
			<div class="limites">

				<?php include 'header_passos.php';?>

				<p>Para ser cliente (pessoa Física ou Jurídica) é necessário
					preencher corretamente o formulário abaixo com os respectivos dados
					cadastrais.</p>
				<p>Os campos em NEGRITO são de preenchimento obrigatório e
					essenciais para processarmos o envio do seu futuro pedido.</p>
				<?php if ($_SESSION["PEDIDO"]["USUARIO"] == "NOVO"){?>
					<ul class="abas">
						<li><a href="<?= BasePainel ?>/editarpf" title="Dados de pessoa física">Pessoa física</a></li>
						<li class="ativo"><a href="<?= BasePainel ?>/editarpj" title="Dados de pessoa jurídica">Pessoa jurídica</a></li>
					</ul>
				<?php }?>

				<form action="<?= BasePainel ?>/controllers/cadastroController.php?acao=editar" class="conta" method="POST">
					<input type="hidden" id="pessoa" name="pessoa" value="<?= ($_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] : "juridica" ?>">
					<fieldset>
						<section>
							<h3>Dados da empresa</h3>
							<ol>
								<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio">
									<label for="razao-social">Razão social</label>
									<input type="text" name="razao-social" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["razao_social"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] ["razao_social"] : "" ?>"
										id="razao-social"> <span>Por favor, preencha a razão social da empresa</span></li>
								<li>
									<ul>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><label for="cnpj">CNPJ</label>
											<input class="medio" type="text" name="cnpj" id="cnpj" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cnpj"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] ["cnpj"] : "" ?>"></li>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><label for="ie">Inscrição Estadual</label>
											<input class="medio" type="text" name="ie" id="ie" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ie"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] ["ie"] : "" ?>"></li>
									</ul>
								</li>
								<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><label for="email">Endereço de e-mail</label><input readonly
									class="medio" type="email" name="email" id="email" value="<?= ($_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["email"] : $_SESSION["email"] ?>"> <small>(será
										usado como usuário)</small></li>
								<li>
									<ul>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><label for="telefone">Telefone</label>
											<input
											class="medio" type="tel" name="telefone" id="telefone" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone1"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd1"] . $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] ["telefone1"] : "" ?>"></li>
										<li><label for="telefone2">Outro telefone</label><input
											class="medio" type="tel" name="telefone2" id="telefone2" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["telefone2"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["ddd2"] . $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]] ["telefone2"] : "" ?>"></li>
									</ul>
								</li>
							</ol>
						</section>

						<section>
							<h3>Endereço</h3>
							<ol>
								<li class="obrigatorio">
									<p title="Preencha seu CEP">CEP</p>
									<ul>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><input class="cep" type="text" name="cep1" id="cep1"
											title="Digite o CEP" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep1"] : "" ?>"></li>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?>"><input class="cep-menor" type="text" name="cep2" id="cep2"
											title="Digite o CEP" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cep2"] : "" ?>"></li>
									</ul>
								</li>
								<li>
									<ul>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><label for="endereco">Endereço</label><input
											class="grande" type="text" name="endereco" id="endereco"  value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["endereco"] : ""?>"></li>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?>obrigatorio"><label for="endereco-numero">Número</label><input
											class="cep" type="text" name="endereco-numero"
											id="endereco-numero"  value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["numero"] : "" ?>"></li>
									</ul>
								</li>
								<li>
									<ul>
										<li><label for="complemento">Complemento</label><input
											class="medio" type="text" name="complemento" id="complemento"  value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["complemento"] : "" ?>"></li>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : "" ?> obrigatorio"><label for="bairro">Bairro</label><input
											class="medio" type="text" name="bairro" id="bairro"  value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["bairro"] : "" ?>"></li>
									</ul>
								</li>
								<li>
									<ul>
										<li class="obrigatorio"><label for="estado">Estado</label>
											<div class="select medio">
												<select name="estado" id="estado">
												<?php
						                        	for ($_i=0; $_i < count($_arrayUf); $_i++) { 
														echo "<option id=\"" . $_arrayUf[$_i] . "\" value=\"" . $_arrayUf[$_i] . "\" " . (($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"]==$_arrayUf[$_i]||($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["uf"]=="" && $_arrayUf[$_i]=="PR"))?"selected=\"selected\"":"") . ">" . $_arrayUf[$_i] . "</option>";
													}
						                        ?>
													
												</select>
											</div></li>
										<li class="<?= (!isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"]) && $_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO") ? "erro" : ""?>obrigatorio"><label for="cidade">Cidade</label><input
											class="medio" type="text" name="cidade" id="cidade" value="<?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["cidade"] : "" ?>"></li>
									</ul>
								</li>
								<li><label for="pontos">Pontos de referência</label> <textarea
										name="pontos" id="pontos" cols="30" rows="10"><?= (isset($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"])) ? $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["informacoes_referencia"] : "" ?></textarea></li>
							</ol>
						</section>
						<?php if ($_SESSION["PEDIDO"]["USUARIO"] == "NOVO"){?>
							<ul>
								<li class="obrigatorio"><label for="senha">Senha</label>
									<input class="pwd" type="password" name="senha" id="senha" required="required"></li>
								<li class="obrigatorio"><label for="confirmacao">Confirmar senha</label>
									<input class="pwd" type="password" name="confirmacao" id="confirmacao" ></li>
								
							</ul>	
						<?php }?>
						<a href="<?= UrlSite ?>" class="voltar"
							title="Voltar à página anterior"><svg width="8px" height="15px">
								<use xlink:href="#icone-seta" class="icone" /></svg> Voltar ao
							site</a>
						<button type="submit">
							Confirmar
							<svg width="8px" height="15px">
								<use xlink:href="#icone-seta" class="icone" /></svg>
						</button>
					</fieldset>
				</form>

			</div>
			<!-- fecha .limites -->

		</div>
		<!-- fecha .conteudo -->

		<?php include 'footer.php';?>

	</div>
	<!-- fecha .carrinho.painel -->
	<!-- abre ícones SVG -->
	<svg style="display: none;">
		<symbol viewBox="0 0 49 46" id="icone-alerta">
		<title>Shape</title>  <g id="alerta-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="alerta-Produto"
			transform="translate(-999 -482)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="alerta-detalhes"
			transform="translate(28 374)" sketch:type="MSLayerGroup"> <g
			id="alerta-indispon&#xED;vel" sketch:type="MSShapeGroup"
			transform="translate(971 108.5)"> <g id="alerta-triangle38"> <g
			id="alerta-Group"> <path id="alerta-Shape"
			d="m47.879 40.902l-21.04-39.303c-0.524-0.9823-1.552-1.599-2.671-1.599h-0.003c-1.119 0-2.144 0.61372-2.672 1.5963l-21.134 39.303c-0.50293 0.943-0.4757 2.074 0.07017 2.981 0.54886 0.91 1.5375 1.469 2.6019 1.469h42.17c1.068 0 2.053-0.556 2.602-1.469 0.549-0.91 0.577-2.041 0.076-2.978zm-23.714-1.599c-1.674 0-3.033-1.355-3.033-3.024 0-1.668 1.359-3.023 3.033-3.023 1.671 0 3.032 1.355 3.032 3.023 0 1.669-1.358 3.024-3.032 3.024zm3.035-12.045c0 1.672-1.361 3.023-3.032 3.023-1.674 0-3.033-1.351-3.033-3.023v-12.093c0-1.669 1.359-3.024 3.033-3.024 1.671 0 3.032 1.355 3.032 3.024v12.093z" /> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 23 21" id="icone-atendimento">
		<title>Shape</title>  <g id="atendimento-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g
			id="atendimento-P&#xE1;gina-Inicial" transform="translate(-589 -28)"
			fill="currentColor" sketch:type="MSArtboardGroup"> <g
			id="atendimento-topo" sketch:type="MSLayerGroup"> <g
			id="atendimento-nav" sketch:type="MSShapeGroup"
			transform="translate(28 25)"> <g id="atendimento-atendimento"
			transform="translate(561.5 3.1855)"> <g id="atendimento-Group"> <path
			id="atendimento-Shape"
			d="m15.675 0.014366c-2.713 0-5.052 1.4318-6.0886 3.48-0.2021-0.0291-0.4003-0.0349-0.5236-0.0349-0.448 0-1.6156 0.0785-2.7824 0.8054-0.6406 0.399-0.9399 0.9663-0.9708 1.8391-0.0001 0.0027-0.0001 0.0052-0.0001 0.008h0.0022l-0.0013 1.4644-0.0005 0.0002c-0.0104 0.003-0.0206 0.0068-0.0303 0.0111-0.1519 0.0684-0.2314 0.0376-0.2503 0.3566-0.0215 0.3634 0.0417 1.3235 0.4338 1.563 0.0586 0.0603 0.0973 0.2248 0.1205 0.4079 0.0435 0.3428 0.0926 0.7308 0.2859 0.9848 0.44 0.579 0.3244 1.475 0.3146 1.544-0.0015 0.001-0.0036 0.002-0.0065 0.004-0.2711 0.122-0.3423 0.359-0.3944 0.532l-0.0266 0.086c-0.0702 0.226-0.1366 0.44-0.228 0.643-0.0123 0.018-0.0653 0.06-0.134 0.086l-0.2003 0.076c-1.2665 0.486-2.576 0.988-3.7922 1.66-1.1497 0.636-1.3914 4.077-1.4012 4.186-0.0058296 0.066 0.016189 0.131 0.060649 0.18 0.044461 0.048 0.10728 0.076 0.17319 0.076h8.3884 8.3879c0.066 0 0.129-0.028 0.174-0.076 0.044-0.049 0.066-0.114 0.06-0.18-0.01-0.109-0.251-3.55-1.401-4.186-1.216-0.672-2.526-1.174-3.792-1.66l-0.2-0.076c-0.069-0.027-0.122-0.068-0.134-0.086-0.092-0.203-0.158-0.417-0.228-0.643l-0.027-0.086c-0.052-0.173-0.123-0.41-0.394-0.532-0.003-0.002-0.005-0.003-0.007-0.004-0.01-0.069-0.125-0.965 0.315-1.544 0.092-0.121 0.151-0.273 0.193-0.435 0.902 0.622 1.993 1.045 3.189 1.189v2.148c0 0.227 0.138 0.431 0.349 0.515 0.067 0.026 0.136 0.039 0.205 0.039 0.15 0 0.296-0.06 0.403-0.173l2.915-3.08c1.069-0.464 1.976-1.1724 2.628-2.0526 0.704-0.9484 1.076-2.0511 1.076-3.1887 0-3.2242-2.988-5.8473-6.66-5.8473v-0.000034zm2.421 10.113c-0.072 0.029-0.137 0.074-0.19 0.131l-2.038 2.152v-1.265c0-0.295-0.232-0.538-0.526-0.553-1.314-0.067-2.5-0.523-3.408-1.2312 0.258-0.36 0.301-1.106 0.283-1.4165-0.019-0.3191-0.099-0.2883-0.25-0.3566-0.01-0.0044-0.02-0.0082-0.031-0.0112v-0.0001-1.4642c-0.001-0.7452-0.181-1.2464-0.553-1.5322-0.164-0.1266-0.353-0.245-0.535-0.3596-0.1-0.0628-0.202-0.1265-0.293-0.1885 0.84-1.7072 2.819-2.9091 5.12-2.9091 3.061 0 5.551 2.1258 5.551 4.7388 0 1.8017-1.228 3.4758-3.13 4.2654z" /> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 24 24" id="icone-busca">
		<title>lupa</title>  <g id="busca-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="busca-P&#xE1;gina-Inicial"
			transform="translate(-926 -139)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="busca-topo"
			sketch:type="MSLayerGroup"> <g id="busca-busca"
			sketch:type="MSShapeGroup" transform="translate(388 128)"> <g
			id="busca-lupa" transform="translate(538 11)"> <g id="busca-Group"
			transform="translate(.000626)"> <path id="busca-Shape"
			d="m22.954 20.127l-5.414-5.498c-0.807 1.274-1.875 2.358-3.13 3.177l5.416 5.497c0.864 0.878 2.266 0.878 3.128 0 0.865-0.876 0.865-2.299 0-3.176z" /> <path
			id="busca-Shape"
			d="m17.702 8.9854c0-4.962-3.963-8.9854-8.8508-8.9854-4.8879 0-8.8512 4.0234-8.8512 8.9854 0.000048645 4.9626 3.9633 8.9856 8.8512 8.9856 4.8878 0 8.8508-4.023 8.8508-8.9856zm-8.8508 6.7386c-3.6606 0-6.6383-3.022-6.6383-6.7385 0-3.7162 2.9777-6.739 6.6383-6.739 3.6608 0 6.6388 3.0228 6.6388 6.739 0 3.7165-2.978 6.7385-6.6388 6.7385z" /> <path
			id="busca-Shape"
			d="m3.6881 8.9854h1.475c0-2.0643 1.6546-3.7439 3.688-3.7439v-1.4975c-2.8465 0-5.163 2.3517-5.163 5.2414z" /> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 24 20" id="icone-carrinho">
		<title>carrinho</title>  <g id="carrinho-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g
			id="carrinho-P&#xE1;gina-Inicial" transform="translate(-1170 -142)"
			fill="currentColor" sketch:type="MSArtboardGroup"> <g
			id="carrinho-topo" sketch:type="MSLayerGroup"> <g
			id="carrinho-compras" sketch:type="MSShapeGroup"
			transform="translate(1161 135)"> <g id="carrinho-carrinho"
			transform="translate(9 7)"> <path id="carrinho-Shape"
			d="m20.311 13.105l2.732-8.3042c0.137-0.3993 0.033-0.6393-0.077-0.7977-0.284-0.4054-0.866-0.4093-0.979-0.4093l-15.439-0.003-0.4118-1.9854c-0.1114-0.4685-0.4401-0.9154-1.1028-0.9154h-4.3389c-0.44987 0-0.6945 0.21385-0.6945 0.6408v1.1461c0 0.4131 0.24387 0.5208 0.71041 0.5208h3.6634l2.8037 12.09c-0.4453 0.479-0.6877 1.177-0.6877 1.829 0 1.434 1.124 2.755 2.5599 2.755 1.3553 0 2.3723-1.29 2.5373-2.059h5.46c0.166 0.769 0.989 2.09 2.537 2.09 1.411 0 2.558-1.241 2.558-2.673 0-1.424-0.852-2.686-2.544-2.686-0.703 0-1.538 0.384-1.926 0.961h-6.709c-0.487-0.769-1.1521-1.007-1.8247-1.034l-0.0931-0.504h10.209c0.769 0 0.921-0.285 1.057-0.662zm-0.708 2.917c0.531 0 0.962 0.437 0.962 0.976 0 0.54-0.431 0.977-0.962 0.977s-0.963-0.437-0.963-0.977c0.001-0.539 0.432-0.976 0.963-0.976zm-9.602 0.976c0 0.546-0.4363 0.99-0.9717 0.99-0.537-0.002-0.974-0.444-0.974-0.99 0-0.545 0.437-0.989 0.974-0.989 0.5354 0 0.9717 0.444 0.9717 0.989z" /> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 24 20" id="icone-cartoes">
		<title>credit2</title>  <g id="cartoes-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="cartoes-Carrinho"
			transform="translate(-1069 -110)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="cartoes-carrinho"
			transform="translate(30 110)" sketch:type="MSLayerGroup"> <g
			id="cartoes-passos" sketch:type="MSShapeGroup"
			transform="translate(777)"> <g id="cartoes-credit2-+-Pagamento"
			transform="translate(242)"> <g id="cartoes-credit2"
			transform="translate(20)"> <g id="cartoes-Group"> <path
			id="cartoes-Shape"
			d="m2.6628 8.8842c0-0.9626 0.7756-1.7456 1.729-1.7456h16.741l-1.981-6.3317c-0.185-0.5885-0.81-0.91767-1.396-0.73064l-16.955 5.4114c-0.58582 0.1871-0.90938 0.818-0.72414 1.409l2.5884 8.2643v-6.2768h-0.0025z" /> <path
			id="cartoes-Shape"
			d="m3.4038 18.999c0 0.551 0.4421 0.997 0.988 0.997h18.03c0.546 0 0.988-0.446 0.988-0.997v-1.347h-20.006l-0.0002 1.347z" /> <path
			id="cartoes-Shape"
			d="m23.41 8.8842c0-0.5511-0.442-0.9975-0.988-0.9975h-1.055-16.975c-0.5461 0-0.9882 0.4464-0.9882 0.9975v6.8958h4.9324 15.074v-6.8958z" /> </g> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 26 20" id="icone-check">
		<title>checked21</title>  <g id="check-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="check-Carrinho"
			transform="translate(-1201 -110)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="check-carrinho"
			transform="translate(30 110)" sketch:type="MSLayerGroup"> <g
			id="check-passos" sketch:type="MSShapeGroup"
			transform="translate(777)"> <g
			id="check-checked21-+-Confirma&#xE7;&#xE3;o-da-compr"
			transform="translate(371)"> <g id="check-checked21"
			transform="translate(23)"> <path id="check-Shape"
			d="m25.129 3.1647l-2.829-2.8505c-0.335-0.33734-0.878-0.33734-1.212 0.00002l-11.784 11.874-5.0118-5.0499c-0.3347-0.3374-0.8776-0.3374-1.2123 0l-2.8288 2.8505c-0.33477 0.3374-0.33477 0.8844 0.00002 1.2214l8.4468 8.512c0.1674 0.168 0.3868 0.253 0.6062 0.253s0.4388-0.085 0.6061-0.253l15.219-15.336c0.161-0.1617 0.251-0.3814 0.251-0.6105 0-0.2292-0.09-0.4488-0.251-0.6108z" /> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 371.23 371.23" id="icone-close">
		<title>close</title> <polygon
			points="371.23,21.213 350.018,0 185.615,164.402 21.213,0 0,21.213 164.402,185.615 0,350.018 21.213,371.23 
  185.615,206.828 350.018,371.23 371.23,350.018 206.828,185.615 " />                </symbol>
		<symbol viewBox="0 0 23 16" id="icone-frete">
		<title>truck</title>  <g id="frete-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="frete-P&#xE1;gina-Inicial"
			transform="translate(-156 -1209)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="frete-galeria-produtos"
			transform="translate(34 816)" sketch:type="MSLayerGroup"> <g
			id="frete-produto" sketch:type="MSShapeGroup"> <g
			id="frete-selo-frete" transform="translate(122 392)"> <g
			id="frete-truck" transform="translate(0 1)"> <path id="frete-Shape"
			d="m0.78598 10.649v-9.6439c0-0.53588 0.42932-0.97032 0.95892-0.97032l9.5251-0.000002c0.53 0 0.959 0.43444 0.959 0.97032v9.6439c0 0.179-0.143 0.323-0.319 0.323h-10.804c-0.17695 0-0.32002-0.144-0.32002-0.323zm7.6921 3.304c0 1.111-0.8905 2.012-1.9888 2.012-1.0984 0-1.9889-0.901-1.9889-2.012 0-1.112 0.8905-2.013 1.9889-2.013 1.0983 0 1.9888 0.901 1.9888 2.013zm-0.9945 0c0-0.556-0.4452-1.007-0.9944-1.007s-0.9944 0.451-0.9944 1.007c0 0.555 0.4452 1.006 0.9944 1.006s0.9944-0.451 0.9944-1.006zm-2.7073-2.013h-4.4567c-0.17649 0-0.3196 0.145-0.3196 0.324v0.981c0 0.179 0.14311 0.323 0.31964 0.323h3.5723c0.0932-0.647 0.4162-1.219 0.8844-1.628zm14.108 2.013c0 1.111-0.89 2.012-1.989 2.012-1.098 0-1.989-0.901-1.989-2.012 0-1.112 0.891-2.013 1.989-2.013 1.099 0 1.989 0.901 1.989 2.013zm-0.994 0c0-0.556-0.446-1.007-0.995-1.007s-0.994 0.451-0.994 1.007c0 0.555 0.445 1.006 0.994 1.006s0.995-0.451 0.995-1.006zm4.51-1.689v0.981c0 0.179-0.143 0.323-0.32 0.323h-2.587c-0.186-1.284-1.278-2.275-2.598-2.275s-2.412 0.991-2.597 2.275h-5.2113c-0.0933-0.647-0.4163-1.219-0.8845-1.628h4.9408v-9.2513c0-0.3573 0.286-0.6469 0.639-0.6469h3.018c0.85 0 1.644 0.4271 2.119 1.1396l1.946 2.9156c0.285 0.4277 0.437 0.9319 0.437 1.4479v4.3951h0.778c0.177 0 0.32 0.145 0.32 0.324zm-3.243-6.0923l-1.555-2.2368c-0.06-0.0861-0.158-0.1373-0.262-0.1373h-2.426c-0.177 0-0.32 0.1448-0.32 0.3234v2.2368c0 0.1787 0.143 0.3235 0.32 0.3235h3.982c0.259 0 0.41-0.2953 0.261-0.5096z" /> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 20 23" id="icone-invoice">
		<title>I</title>  <g stroke="none" stroke-width="1" fill="none"
			fill-rule="evenodd"> <g id="invoice-Painel-do-usu&#xE1;rio---Pedidos"
			transform="translate(-985.000000, -350.000000)" fill="currentColor"> <g
			id="invoice-conte&#xFA;do"
			transform="translate(27.000000, 111.000000)"> <g id="invoice-pedido"
			transform="translate(0.000000, 167.000000)"> <g id="invoice-tabela"> <g
			id="invoice-item-aberto" transform="translate(0.000000, 43.000000)"> <g
			id="invoice-invoice" transform="translate(958.000000, 29.000000)"> <g
			id="invoice-Layer_1"> <g> <path
			d="M16.0612329,15.3333184 C13.9126941,15.3333184 12.1647489,17.0529277 12.1647489,19.1666367 C12.1647489,21.2803457 13.9126484,23 16.0612329,23 C18.2098174,23 19.9577169,21.2803906 19.9577169,19.1666816 C19.9577169,17.0529727 18.2097717,15.3333184 16.0612329,15.3333184 Z M16.0612329,22.1481465 C14.390137,22.1481465 13.0306393,20.8106875 13.0306393,19.1666816 C13.0306393,17.5226758 14.390137,16.1852168 16.0612329,16.1852168 C17.7323288,16.1852168 19.0918265,17.5226758 19.0918265,19.1666816 C19.0918265,20.8106875 17.7323288,22.1481465 16.0612329,22.1481465 Z"
			id="invoice-Shape" /> <path
			d="M18.070137,17.561668 C17.8864384,17.4111797 17.613516,17.4355273 17.4603653,17.616248 L15.5992237,19.8134668 L14.6355708,18.8655254 C14.4666667,18.6991348 14.1922831,18.6991348 14.023379,18.8655254 C13.8542466,19.0317812 13.8542466,19.3015371 14.023379,19.467793 L15.3221918,20.7455508 C15.4035616,20.8256016 15.5136986,20.8703437 15.6283105,20.8703437 C15.6348402,20.8703437 15.6414155,20.8702539 15.6479452,20.8699395 C15.7694064,20.8645488 15.8830137,20.8089805 15.9609132,20.7170703 L18.1256164,18.1615098 C18.2786758,17.980834 18.2538356,17.7123359 18.070137,17.561668 Z"
			id="invoice-Shape" /> <path
			d="M16.0612329,0 L0.475205479,0 C0.236118721,0 0.0422374429,0.190693359 0.0422374429,0.425949219 L0.0422374429,21.7222422 C0.0422374429,21.8757402 0.126164384,22.0172441 0.261872146,22.0928477 C0.39739726,22.168541 0.564063927,22.1664746 0.697899543,22.087457 L2.61305936,20.957043 L4.11187215,22.0630195 C4.25278539,22.1670137 4.44365297,22.176582 4.59438356,22.087457 L6.50954338,20.957043 L8.00835616,22.0630195 C8.08511416,22.1195762 8.17639269,22.1481914 8.26817352,22.1481914 C8.34502283,22.1481914 8.42219178,22.1281113 8.49086758,22.087457 L10.6555708,20.8096992 C10.8606393,20.6886797 10.9271233,20.4270098 10.8040639,20.2254004 C10.6810502,20.023791 10.4149772,19.95825 10.210137,20.0793145 L8.29497717,21.2097285 L6.79616438,20.103752 C6.65506849,19.9997578 6.46438356,19.9900996 6.31365297,20.0793145 L4.39849315,21.2097285 L2.89968037,20.103752 C2.75858447,19.9997578 2.56789954,19.9900996 2.41716895,20.0793145 L0.908173516,20.9699805 L0.908173516,0.851853516 L15.6282648,0.851853516 L15.6282648,14.0555605 C15.6282648,14.2907715 15.8221005,14.4814648 16.0611872,14.4814648 C16.300274,14.4814648 16.4941553,14.2907715 16.4941553,14.0555605 L16.4941553,0.425949219 C16.4941553,0.190693359 16.3003196,0 16.0612329,0 Z"
			id="invoice-Shape" /> <path
			d="M4.80465753,3.83331836 L2.63995434,3.83331836 C2.40086758,3.83331836 2.2069863,4.02401172 2.2069863,4.25926758 C2.2069863,4.49452344 2.40082192,4.6852168 2.63995434,4.6852168 L4.80465753,4.6852168 C5.04374429,4.6852168 5.23757991,4.49452344 5.23757991,4.25926758 C5.23757991,4.02401172 5.04374429,3.83331836 4.80465753,3.83331836 Z"
			id="invoice-Shape" /> <path
			d="M13.0305936,5.96297461 L10.8658904,5.96297461 C10.6268037,5.96297461 10.432968,6.15366797 10.432968,6.38892383 C10.432968,6.62417969 10.6268037,6.81482813 10.8658904,6.81482813 L13.0305936,6.81482813 C13.2696804,6.81482813 13.4635616,6.62413477 13.4635616,6.38892383 C13.4635616,6.15371289 13.269726,5.96297461 13.0305936,5.96297461 Z"
			id="invoice-Shape" /> <path
			d="M13.0305936,8.09258594 L10.8658904,8.09258594 C10.6268037,8.09258594 10.432968,8.2832793 10.432968,8.51853516 C10.432968,8.75379102 10.6268037,8.94443945 10.8658904,8.94443945 L13.0305936,8.94443945 C13.2696804,8.94443945 13.4635616,8.75374609 13.4635616,8.51853516 C13.4635616,8.28332422 13.269726,8.09258594 13.0305936,8.09258594 Z"
			id="invoice-Shape" /> <path
			d="M13.0305936,10.2222422 L10.8658904,10.2222422 C10.6268037,10.2222422 10.432968,10.4129355 10.432968,10.6481914 C10.432968,10.8834473 10.6268037,11.0740957 10.8658904,11.0740957 L13.0305936,11.0740957 C13.2696804,11.0740957 13.4635616,10.8834023 13.4635616,10.6481914 C13.4635616,10.4129805 13.269726,10.2222422 13.0305936,10.2222422 Z"
			id="invoice-Shape" /> <path
			d="M13.0305936,12.3518535 L10.8658904,12.3518535 C10.6268037,12.3518535 10.432968,12.5425469 10.432968,12.7778027 C10.432968,13.0130586 10.6268037,13.203707 10.8658904,13.203707 L13.0305936,13.203707 C13.2696804,13.203707 13.4635616,13.0130137 13.4635616,12.7778027 C13.4635616,12.5425918 13.269726,12.3518535 13.0305936,12.3518535 Z"
			id="invoice-Shape" /> <path
			d="M13.0305936,14.4814648 L10.8658904,14.4814648 C10.6268037,14.4814648 10.432968,14.6721582 10.432968,14.9074141 C10.432968,15.1426699 10.6268037,15.3333184 10.8658904,15.3333184 L13.0305936,15.3333184 C13.2696804,15.3333184 13.4635616,15.142625 13.4635616,14.9074141 C13.4635616,14.6722031 13.269726,14.4814648 13.0305936,14.4814648 Z"
			id="invoice-Shape" /> <path
			d="M8.70118721,5.96297461 L2.63995434,5.96297461 C2.40086758,5.96297461 2.2069863,6.15366797 2.2069863,6.38892383 C2.2069863,6.62417969 2.40082192,6.81482813 2.63995434,6.81482813 L8.70118721,6.81482813 C8.94027397,6.81482813 9.13415525,6.62413477 9.13415525,6.38892383 C9.13415525,6.15371289 8.94027397,5.96297461 8.70118721,5.96297461 Z"
			id="invoice-Shape" /> <path
			d="M8.70118721,8.09258594 L2.63995434,8.09258594 C2.40086758,8.09258594 2.2069863,8.2832793 2.2069863,8.51853516 C2.2069863,8.75379102 2.40082192,8.94443945 2.63995434,8.94443945 L8.70118721,8.94443945 C8.94027397,8.94443945 9.13415525,8.75374609 9.13415525,8.51853516 C9.13415525,8.28332422 8.94027397,8.09258594 8.70118721,8.09258594 Z"
			id="invoice-Shape" /> <path
			d="M8.70118721,10.2222422 L2.63995434,10.2222422 C2.40086758,10.2222422 2.2069863,10.4129355 2.2069863,10.6481914 C2.2069863,10.8834473 2.40082192,11.0740957 2.63995434,11.0740957 L8.70118721,11.0740957 C8.94027397,11.0740957 9.13415525,10.8834023 9.13415525,10.6481914 C9.13415525,10.4129805 8.94027397,10.2222422 8.70118721,10.2222422 Z"
			id="invoice-Shape" /> <path
			d="M8.70118721,12.3518535 L2.63995434,12.3518535 C2.40086758,12.3518535 2.2069863,12.5425469 2.2069863,12.7778027 C2.2069863,13.0130586 2.40082192,13.203707 2.63995434,13.203707 L8.70118721,13.203707 C8.94027397,13.203707 9.13415525,13.0130137 9.13415525,12.7778027 C9.13415525,12.5425918 8.94027397,12.3518535 8.70118721,12.3518535 Z"
			id="invoice-Shape" /> <path
			d="M8.70118721,14.4814648 L2.63995434,14.4814648 C2.40086758,14.4814648 2.2069863,14.6721582 2.2069863,14.9074141 C2.2069863,15.1426699 2.40082192,15.3333184 2.63995434,15.3333184 L8.70118721,15.3333184 C8.94027397,15.3333184 9.13415525,15.142625 9.13415525,14.9074141 C9.13415525,14.6722031 8.94027397,14.4814648 8.70118721,14.4814648 Z"
			id="invoice-Shape" /> </g> </g> </g> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 19 19" id="icone-key">
		<title>house-key</title>  <g stroke="none" stroke-width="1"
			fill="none" fill-rule="evenodd"> <g
			id="key-Painel-do-usu&#xE1;rio---Pedidos"
			transform="translate(-981.000000, -129.000000)" fill="currentColor"> <g
			id="key-conte&#xFA;do" transform="translate(27.000000, 111.000000)"> <g
			id="key-nav" transform="translate(662.000000, 17.000000)"> <g
			id="key-item-copy-3" transform="translate(292.000000, 1.000000)"> <g
			id="key-house-key"> <g id="key-Layer_1"> <path
			d="M18.4887937,15.6786538 C18.4797587,15.5609336 18.4271434,15.4477308 18.3408462,15.3632937 L10.8841434,7.90659091 C11.177514,7.21548252 11.3323706,6.46704196 11.3323706,5.69355594 C11.3323706,4.18192657 10.7427727,2.75965035 9.67565035,1.68987063 C8.607,0.622216783 7.18572028,0.0332167832 5.67322727,0.0332167832 C4.1600035,0.0332167832 2.74118182,0.622416084 1.6708042,1.69073427 C-0.537646853,3.89798951 -0.538111888,7.48812587 1.67047203,9.69518182 C2.74078322,10.7657587 4.16006993,11.3553566 5.6724965,11.3553566 C6.44618182,11.3553566 7.19276224,11.1992378 7.88553147,10.9054685 L10.3352028,13.357 C10.4371119,13.4576469 10.571507,13.5110594 10.7165315,13.5063427 L12.051514,13.459507 L12.0079336,14.7978112 C12.0038147,14.9389825 12.0547692,15.0763671 12.1570769,15.1768811 C12.2556643,15.2773287 12.3941783,15.3319371 12.5347517,15.3262238 L13.8746503,15.280451 L13.8265524,16.6172937 C13.8223671,16.7585979 13.8766434,16.8962483 13.9752308,16.9967622 C14.0771399,17.0972098 14.1958566,17.1512203 14.3565594,17.1463042 L15.6931364,17.1008636 L15.6483601,18.4379056 C15.640521,18.5861853 15.7029685,18.7288182 15.8089965,18.8300629 C15.9067867,18.9190175 16.0288252,18.9669161 16.1574406,18.9669161 C16.1759091,18.9669161 16.1948427,18.9661189 16.2137098,18.964458 L18.2632517,18.7368566 C18.5402133,18.7066294 18.7419056,18.4594965 18.7181224,18.1819371 L18.4887937,15.6786538 Z M5.43582539,5.49520169 C4.70404321,6.23513014 3.52095932,6.23513014 2.79072164,5.49520169 C2.05940281,4.75503873 2.05940281,3.55775539 2.79072164,2.81829594 C3.52095932,2.07883649 4.70365708,2.07813299 5.43582539,2.81806144 C6.16614029,3.55744272 6.16567694,4.75550774 5.43582539,5.49520169 Z M16.7392657,15.8493881 C16.6644615,15.9241923 16.5642133,15.961528 16.4668217,15.961528 C16.3694301,15.961528 16.2691154,15.9241259 16.1943776,15.8493881 L9.84990559,9.50305594 C10.0265524,9.31259091 10.1871888,9.11209441 10.3330769,8.9013007 L16.7391993,15.3061608 C16.8888077,15.4557692 16.8888077,15.6998462 16.7392657,15.8493881 Z"
			id="key-Shape" /> </g> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 24 17" id="icone-mail">
		<title>Group</title>  <g id="mail-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="mail-Produto"
			transform="translate(-1034 -625)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="mail-detalhes"
			transform="translate(28 374)" sketch:type="MSLayerGroup"> <g
			id="mail-mail" sketch:type="MSShapeGroup"
			transform="translate(1006 251)"> <g id="mail-Group"> <path
			id="mail-Shape"
			d="m12 11.9l-2.9691-2.5772-8.4892 7.2162c0.30859 0.284 0.7252 0.461 1.1846 0.461h20.548c0.457 0 0.872-0.177 1.179-0.461l-8.484-7.2162-2.969 2.5772z" /> <path
			id="mail-Shape"
			d="m23.458 0.4607c-0.308-0.2856-0.723-0.4607-1.184-0.4607h-20.548c-0.4574 0-0.87229 0.1768-1.1809 0.4641l11.455 9.7359 11.458-9.7393z" /> <path
			id="mail-Shape" d="m0 1.4926v14.123l8.2851-6.9817-8.2851-7.1417z" /> <path
			id="mail-Shape"
			d="m15.715 8.6343l8.285 6.9817v-14.128l-8.285 7.1463z" /> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 9 6" id="icone-seta-baixo">
		<title>Triangle 1 Copy</title>  <g id="seta-baixo-Desktop"
			fill-rule="evenodd" sketch:type="MSPage" fill="none"> <g
			id="seta-baixo-P&#xE1;gina-Inicial" transform="translate(-1098 -160)"
			fill="currentColor" sketch:type="MSArtboardGroup"> <g
			id="seta-baixo-topo" sketch:type="MSLayerGroup"> <g
			id="seta-baixo-Triangle-1-Copy-+-Ol&#xE1;-Gustavo."
			sketch:type="MSShapeGroup" transform="translate(1004 129.5)"> <path
			id="seta-baixo-Triangle-1-Copy" d="m94 31h9l-4.5 5.255-4.5-5.255z" /> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 18 18" id="icone-seta-voltar">
		<title>Voltar</title>  <g stroke="none" stroke-width="1" fill="none"
			fill-rule="evenodd"> <g
			id="seta-voltar-Painel-do-usu&#xE1;rio---Pedidos"
			transform="translate(-1135.000000, -131.000000)" fill-rule="nonzero"
			fill="currentColor"> <g id="seta-voltar-conte&#xFA;do"
			transform="translate(27.000000, 111.000000)"> <g id="seta-voltar-nav"
			transform="translate(662.000000, 17.000000)"> <g
			id="seta-voltar-item-copy-4"
			transform="translate(446.000000, 1.000000)"> <g
			id="seta-voltar-previous" transform="translate(0.000000, 2.000000)"> <g
			id="seta-voltar-Layer_1"> <g id="seta-voltar-Group"> <path
			d="M8.99265306,17.9853061 C13.9518367,17.9853061 17.9853061,13.9518367 17.9853061,8.99265306 C17.9853061,4.03346939 13.9518367,0 8.99265306,0 C4.03346939,0 0,4.03346939 0,8.99265306 C0,13.9518367 4.03346939,17.9853061 8.99265306,17.9853061 Z M8.99265306,0.727346939 C13.5514286,0.727346939 17.2579592,4.43387755 17.2579592,8.99265306 C17.2579592,13.5514286 13.5514286,17.2579592 8.99265306,17.2579592 C4.43387755,17.2579592 0.727346939,13.5514286 0.727346939,8.99265306 C0.727346939,4.43387755 4.43387755,0.727346939 8.99265306,0.727346939 Z"
			id="seta-voltar-Shape" /> <path
			d="M9.75306122,11.9791837 C9.82285714,12.0489796 9.91836735,12.0857143 10.0102041,12.0857143 C10.1020408,12.0857143 10.197551,12.0489796 10.2673469,11.9791837 C10.4106122,11.8359184 10.4106122,11.6081633 10.2673469,11.464898 L7.79510204,8.99265306 L10.2673469,6.52040816 C10.4106122,6.37714286 10.4106122,6.14938776 10.2673469,6.00612245 C10.1240816,5.86285714 9.89632653,5.86285714 9.75306122,6.00612245 L7.02367347,8.7355102 C6.88040816,8.87877551 6.88040816,9.10653061 7.02367347,9.24979592 L9.75306122,11.9791837 Z"
			id="seta-voltar-Shape" /> </g> </g> </g> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 11 20" id="icone-seta">
		<title>Shape</title>  <g id="seta-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="seta-P&#xE1;gina-Inicial"
			transform="translate(-32 -712)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="seta-marcas"
			transform="translate(32 698)" sketch:type="MSLayerGroup"> <g
			id="seta-arrow395" sketch:type="MSShapeGroup"
			transform="translate(0 14)"> <path id="seta-Shape"
			d="m10.241 19.876l-10.196-9.9383 10.196-9.9377 0.528 0.54553-9.6347 9.3922 9.6347 9.3923-0.528 0.546z" /> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 21 21" id="icone-telefone">
		<title>Shape</title>  <g id="telefone-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g
			id="telefone-P&#xE1;gina-Inicial" transform="translate(-785 -28)"
			fill="currentColor" sketch:type="MSArtboardGroup"> <g
			id="telefone-topo" sketch:type="MSLayerGroup"> <g id="telefone-nav"
			sketch:type="MSShapeGroup" transform="translate(28 25)"> <g
			id="telefone-telefone" transform="translate(757.5 3.1855)"> <path
			id="telefone-Shape"
			d="m19.501 15.809l-3.071-3.089c-0.612-0.613-1.625-0.595-2.259 0.042l-1.547 1.557c-0.098-0.055-0.199-0.111-0.305-0.171-0.978-0.545-2.315-1.291-3.7228-2.708-1.4116-1.42-2.1545-2.7669-2.6976-3.7504-0.0573-0.1042-0.1123-0.2047-0.1665-0.3001l1.0386-1.043 0.5107-0.5142c0.6341-0.6379 0.6516-1.6567 0.0412-2.2713l-3.0717-3.0901c-0.6104-0.61377-1.6241-0.59515-2.2582 0.04278l-0.8657 0.87572 0.0236 0.0236c-0.29026 0.3725-0.53283 0.8022-0.71334 1.2655-0.1664 0.441-0.27 0.8619-0.31737 1.2836-0.4056 3.3819 1.131 6.4729 5.301 10.667 5.7641 5.797 10.409 5.359 10.61 5.337 0.436-0.052 0.855-0.157 1.28-0.323 0.456-0.179 0.883-0.423 1.253-0.714l0.019 0.017 0.877-0.864c0.633-0.638 0.651-1.657 0.041-2.273z" /> </g> </g> </g> </g> </g> </symbol>
		<symbol viewBox="0 0 20 20" id="icone-usuario">
		<title>user168</title>  <g id="usuario-Desktop" fill-rule="evenodd"
			sketch:type="MSPage" fill="none"> <g id="usuario-Carrinho"
			transform="translate(-943 -110)" fill="currentColor"
			sketch:type="MSArtboardGroup"> <g id="usuario-carrinho"
			transform="translate(30 110)" sketch:type="MSLayerGroup"> <g
			id="usuario-passos" sketch:type="MSShapeGroup"
			transform="translate(777)"> <g
			id="usuario-user168-+-Identifica&#xE7;&#xE3;o"
			transform="translate(110)"> <g id="usuario-user168"
			transform="translate(26)"> <g id="usuario-Group"> <path
			id="usuario-Shape"
			d="m10.004 10.598c2.465 0 4.464-2.3623 4.464-5.2765 0-4.0411-1.998-5.2765-4.464-5.2765-2.4656 0.000012-4.4642 1.2354-4.4642 5.2765 0.0001 2.9142 1.9987 5.2765 4.4642 5.2765z" /> <path
			id="usuario-Shape"
			d="m19.862 18.364l-2.252-5.123c-0.103-0.234-0.284-0.429-0.51-0.547l-3.495-1.838c-0.077-0.04-0.17-0.032-0.24 0.021-0.988 0.755-2.151 1.154-3.361 1.154-1.2105 0-2.3728-0.399-3.3614-1.154-0.0695-0.053-0.1628-0.061-0.2399-0.021l-3.4952 1.838c-0.2253 0.118-0.4061 0.312-0.5092 0.547l-2.2523 5.123c-0.15525 0.354-0.12342 0.758 0.08519 1.082 0.20852 0.324 0.56141 0.517 0.94401 0.517h17.658c0.382 0 0.735-0.193 0.944-0.517 0.208-0.324 0.24-0.728 0.085-1.082z" /> </g> </g> </g> </g> </g> </g> </g> </symbol></svg>
	<!-- fecha ícones SVG -->

	<!-- abre scripts -->
	<script
		src="<?= BasePainel ?>/resources/bower_components/jquery/dist/jquery.min.js"></script>
	<script src="<?= BasePainel ?>/resources/js/plugins.min.js"></script>
	<script src="<?= BasePainel ?>/resources/js/_bower.min.js"></script>
	<script src="<?= BasePainel ?>/resources/js/main.min.js" defer></script>
	<script src="<?= BasePainel ?>/resources/js/jquery-maskinput-1.1.4.js" defer></script>
	<!-- fecha scripts -->
	<script type="text/javascript">
		var password = document.getElementById("senha"), confirm_password = document.getElementById("confirmacao");
			
		function validatePassword(){
		  if(password.value != confirm_password.value) {
		    confirm_password.setCustomValidity("Senhas não são iguais");
		  } else {
		    confirm_password.setCustomValidity('');
		  }
		}
		$(document).ready(function(){
		    $("#cnpj").mask("99.999.999/9999-99");
		    $("#telefone").mask("(99) 99999-999?9");
		    $("#telefone2").mask("(99) 99999-999?9");
		    $("#cep1").keyup(function() {
		        var valor = $("#cep1").val().replace(/[^0-9]+/g,'');
		        $("#cep1").val(valor);
		        
		        if ($("#cep1").val().length==5)
		            $("#cep2").focus();
		    }); 
		    $("#cep2").keyup(function(e) {
		        var valor = $("#cep2").val().replace(/[^0-9]+/g,'');
		        $("#cep2").val(valor);
		        
		        var dad1 = $('input[name=cep1]').parent();
				if (dad1.hasClass("erro"))
					dad1.removeClass("erro");
				
				var dad2 = $('input[name=cep2]').parent();
				if (dad2.hasClass("erro"))
					dad2.removeClass("erro");
				
				var cepCampo1 = $("#cep1").val().replace(/[^0-9]+/g,'');
				if (cepCampo1.length == 5 && $("#cep2").val().length == 3) {
					var dados = {'cep1':cepCampo1, 'cep2':$('#cep2').val()};
					$.ajax({
						url: "<?= BasePainel ?>/util/inputCepXml.php",
						data: dados,
						//contentType: "application/json; charset=utf-8",
						//dataType: "json",
						
						success: function(cep){
							var cidade = $(cep).find('cidade').text();
							var uf = $(cep).find('uf').text();
							var endereco = $(cep).find('tipo').text() + " " + $(cep).find('logradouro').text();
							var bairro = $(cep).find('bairro').text();
							
							$('input[name=cidade]').val(cidade);
							$("select option").removeAttr("selected");
							
							document.getElementById(uf).selected = true;
							
							$('input[name=endereco]').val(endereco);
							$('input[name=bairro]').val(bairro);
							
							$('input[name=endereco-numero]').focus();
						}
					});
				} else {
					
					if (dad.hasClass("erro"))
						dad.removeClass("erro");
					
					alert("Cep inválido!");
					$('input[name=cep1]').addClass("erro");
					$('input[name=cep2]').addClass("erro");
				}
		    })
		})
	</script>

</body>
</html>
