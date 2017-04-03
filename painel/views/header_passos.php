<header>
	<h2>Sua conta</h2>
	<ol class="passos" role="navigation">
		<?php if (isset($_SESSION["PEDIDO"]["USUARIO"])) {?>
			<?php if ($_SESSION["PEDIDO"]["USUARIO"] == "NOVO") {?>
				<li>
					<a title="Ver seus pedidos">
						<svg width="24px" height="20px"><use xlink:href="#icone-carrinho" class="icone" /></svg>
						Pedidos
					</a>
				</li>
				<li>
					<a title="Alterar seus dados cadastrais"><svg width="20px" height="20px">
						<use xlink:href="#icone-usuario" class="icone" /></svg> 
						Alterar Cadastro
					</a>
				</li>
				<li>
					<a title="Alterar senha">
						<svg width="18px" height="19px"><use xlink:href="#icone-key" class="icone" /></svg> 
						Alterar Senha
					</a>
				</li>
			<?php }elseif ($_SESSION["PEDIDO"]["USUARIO"] == "CADASTRADO"){?>
				<li class="<?= ($_REQUEST["page"] == "painel") ? "ativo" : "" ?>">
					<a href="<?= UrlSite . BasePainel ?>/pedidos" title="Ver seus pedidos">
						<svg width="24px" height="20px"><use xlink:href="#icone-carrinho" class="icone" /></svg>
						Pedidos
					</a>
				</li>
				<?php if ($_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]["pessoa"] == "fisica") {?>
					<li class="<?= ($_REQUEST["page"] == "cadastroPainel") ? "ativo" : "" ?>"><a
						href="<?= UrlSite . BasePainel ?>/editarpf"
						title="Alterar seus dados cadastrais"><svg width="20px" height="20px">
												<use xlink:href="#icone-usuario" class="icone" /></svg> Alterar
							Cadastro</a></li>
				<?php }else{?>
					<li class="<?= ($_REQUEST["page"] == "cadastroPainel") ? "ativo" : "" ?>"><a
						href="<?= UrlSite . BasePainel ?>/editarpj"
						title="Alterar seus dados cadastrais"> <svg width="20px"
								height="20px">
						<use xlink:href="#icone-usuario" class="icone" /></svg> Alterar
							Cadastro
					</a></li>
				<?php }?>
				<li class="<?= ($_REQUEST["page"] == "senhaPainel") ? "ativo" : "" ?>">
					<a href="<?= UrlSite . BasePainel ?>/alterarsenha" title="Alterar senha">
						<svg width="18px" height="19px">
						<use xlink:href="#icone-key" class="icone" /></svg> 
						Alterar Senha
					</a>
				</li>
				<li>
					<a href="<?= UrlSite . BasePainel ?>/logout" title="logout">
						<svg width="18px" height="19px"><use xlink:href="#icone-key" class="icone" /></svg> 
						Logout
					</a>
				</li>
			<?php }?>
			<li>
				<a href="<?= UrlSite ?>" title="Voltar ao site">
					<svg width="18px" height="18px">
					<use xlink:href="#icone-seta-voltar" class="icone" /></svg>
					Voltar ao site
				</a>
			</li>
		<?php }else{?>
			<li><a title="Ver seus pedidos"> <svg width="24px" height="20px">
					<use xlink:href="#icone-carrinho" class="icone" />
				</svg> Pedidos
		</a></li>

		<li><a title="Alterar seus dados cadastrais"> <svg width="20px"
					height="20px">
					<use xlink:href="#icone-usuario" class="icone" />
				</svg> Alterar Cadastro
		</a></li>

		<li><a title="Alterar senha"> <svg width="18px" height="19px">
					<use xlink:href="#icone-key" class="icone" />
				</svg> Alterar Senha
		</a></li>
		<li><a href="<?= UrlSite ?>" title="Voltar ao site"> <svg width="18px"
					height="18px">
					<use xlink:href="#icone-seta-voltar" class="icone" />
				</svg> Voltar ao site
		</a></li>
		<?php }?>
		
	</ol>
</header>
