<!-- abre .rodape -->
<footer class="rodape">

  <!-- abre .limites -->
  <div class="limites centro">
    <h2>Fique por dentro das nossas novidades!</h2>
    <p>Cadastre seu e-mail para receber nossa newsletter com ofertas e descontos exclusivos:</p>
    <form name="news" id="news" action="<?php echo URL; ?>actions/operador.php?tabela=<?php echo TB_New; ?>&acao=gravar" method="post">
      <fieldset>
        <input type="email" name="newsletter" id="newsletter">
        <button type="submit">Enviar <svg width="8px" height="15px"><use xlink:href="#icone-seta" class="icone" /></svg></button>
      </fieldset>
    </form>
  </div>
  <!-- fecha .limites -->

  <div class="social">

    <ul class="centro">
      <li><a href="https://www.facebook.com/planderinstrumentos/" rel="external" title="Visitar a página da Plander no Facebook"><svg width="22px" height="40px"><use xlink:href="#icone-facebook" class="icone" /></svg></a></li>
      <li><a href="https://www.instagram.com/plander_instrumentos/" rel="external" title="Visitar o perfil da Plander no Instagram"><svg width="40px" height="40px"><use xlink:href="#icone-instagram" class="icone" /></svg></a></li>
      <li><a href="https://www.youtube.com/channel/UCRdIzK51i1RYoSSFdDgH34w" rel="external" title="Visitar o canal da Plander no YouTube"><svg width="34px" height="40px"><use xlink:href="#icone-youtube" class="icone" /></svg></a></li>
    </ul>

  </div>

  <div class="banners centro">

    <!-- abre .limites -->
    <div class="limites">
      <img src="<?php echo URL; ?>imagens/rodape-banner-1.jpg" alt="Enviamos para todo o Brasil">
      <img src="<?php echo URL; ?>imagens/rodape-banner-2.jpg" alt="3 meses de garantia">
      <img src="<?php echo URL; ?>imagens/rodape-banner-3.jpg" alt="Compras 100% seguras">
      <img src="<?php echo URL; ?>imagens/rodape-banner-4.jpg" alt="25 anos no mercado">
    </div>
    <!-- fecha .limites -->

  </div>

  <div class="mapa">

    <!-- abre .limites -->
    <div class="limites">
      <img src="<?php echo URL; ?>imagens/logo.png" alt="Plander.com">
      <div>
        <h3>Contato</h3>
        <ul>
          <li><?php echo TELEFONE; ?></li>
		  <!--<li><?php //echo CELULAR_2; ?></li>-->
          <li class="whatsapp"><strong><?php echo CELULAR; ?><img src="<?php echo URL; ?>imagens/icone-whatsapp.png" alt="WhatsApp"></strong></li>
        </ul>
        <h3>Horário de Atendimento</h3>
        <ul>
          <li>Segunda a sexta das 9h às 18h.</li>
          <li>Sábado das 9h às 13h.</li>
        </ul>
      </div>
      <div>
        <h3>Institucional</h3>
        <ul>
          <li><a href="<?php echo URL; ?>faleConosco" title="Visitar a página Fale Conosco">Fale Conosco</a></li>
          <li><a href="<?php echo URL; ?>quemSomos" title="Visitar a página Quem Somos">Quem Somos</a></li>
          <li><a href="<?php echo URL; ?>produtosPlander" title="Visitar a página Conheça os Produtos Plander">Conheça os Produtos Plander</a></li>
          <li><a href="<?php echo URL; ?>produtosZion" title="Visitar a página Conheça os Produtos Zion">Conheça os Produtos Zion</a></li>
        
          <li><a href="<?php echo URL; ?>politicas#privacidade" title="Visitar a página Política de Privacidade">Política de Privacidade</a></li>
          <li><a href="<?php echo URL; ?>politicas#pagamento" title="Visitar a página Política de Pagamento">Política de Pagamento</a></li>
          <li><a href="<?php echo URL; ?>politicas#garantia" title="Visitar a página Política de Garantia">Política de Garantia</a></li>
          <li><a href="<?php echo URL; ?>politicas#entrega" title="Visitar a página Política de Entregas">Política de Entrega</a></li>
          <li><a href="<?php echo URL; ?>politicas#trocas" title="Visitar a página Política de Trocas e devoluções">Política de Trocas e devoluções</a></li>
        </ul>
      </div>
      <div>
        <h3>Formas de Pagamento</h3>
        <ul class="pagamento centro">
          <li><img src="<?php echo URL; ?>imagens/pagamento-master.png" alt="MasterCard"></li>
          <li><img src="<?php echo URL; ?>imagens/pagamento-visa.png" alt="Visa"></li>
          <li><img src="<?php echo URL; ?>imagens/pagamento-boleto.png" alt="Boleto"></li>
        </ul>
        <small>Outros cartões consulte equipe</small>
        <h4>Segurança</h4>
        <ul class="seguranca centro">
          <li><img src="<?php echo URL; ?>imagens/seguranca-ssl.jpg" alt="Secured by RapidSSL"></li>
          <li><img src="<?php echo URL; ?>imagens/seguranca-correios.jpg" alt="Entrega garantida Correios"></li>
          <li><img src="<?php echo URL; ?>imagens/seguranca-ebit.jpg" alt="ebit"></li>
        </ul>
      </div>
    </div>
    <!-- fecha .limites -->

  </div>

  <p class="copyright centro">&copy; <?php echo date("Y"); ?> Plander.com – Todos os direitos reservados <span>| CNPJ: <?php echo CNPJ; ?> |</span> Rua Alferes Poli, 620 - Centro - Curitiba, PR</p>

</footer>
<!-- fecha .rodape -->