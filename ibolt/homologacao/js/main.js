(function(){

  // Responsive
  var size = window.getComputedStyle(document.body,':after').getPropertyValue('content');

  window.addEventListener("resize", function(){
    size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
  });

  // Touch
  function isTouchDevice() {
    return 'ontouchstart' in document.documentElement;
  }


  // Telas pequenas
  if (size.indexOf("geral") !=-1) {
    var qntMarcas = 3;
    var qntProdutos = 2;
    var qntThumbs = 3;
  }

  // Telas médias
  if (size.indexOf("medium") !=-1) {
    var qntMarcas = 6;
    var qntProdutos = 3;
    var qntThumbs = 4;
  }

  // Telas Maiores
  if (size.indexOf("large") !=-1) {
    var qntMarcas = 9;
    var qntProdutos = 5;
    var qntThumbs = 4;
  }


  // Links externos
  var externos = document.querySelectorAll('a[rel="external"]');
  Array.prototype.forEach.call(externos, function(el, i){
    el.setAttribute('target', '_blank');
  });


  // Topo

    if (document.querySelector('#icone-menu') != null) {

      // Animação para ícone do topo
      var iconeTopo = Snap('#icone-menu'),
          linha1 = iconeTopo.select('#menu-linha1'),
          linha2 = iconeTopo.select('#menu-linha2'),
          linha3 = iconeTopo.select('#menu-linha3');

      // Animação para fechar
      function animaFechar() {
        linha1.animate({d: 'M20.2,20.4L3,3.1C2.7,2.8,2.7,2.3,3,2l1.6-1.6c0.3-0.3,0.8-0.3,1.1,0L23,17.6c0.3,0.3,0.3,0.8,0,1.1l-1.6,1.6C21.1,20.6,20.5,20.6,20.2,20.4z'}, 200)
        linha2.animate({d: 'M13,12.3L13,12.3c0,0,0-0.4,0-0.8V9.2c0-0.5,0-0.8,0-0.8h0c0,0,0,0.4,0,0.8v2.3C13,11.9,13,12.3,13,12.3z'}, 200)
        linha3.animate({d: 'M23,3.1L5.8,20.4c-0.4,0.4-0.8,0.3-1.1,0L3,18.7c-0.4-0.4-0.3-0.8,0-1.1L20.2,0.3c0.4-0.4,0.8-0.3,1.1,0L23,2C23.3,2.3,23.3,2.8,23,3.1z'}, 200)
      }

      // Animação para menu
      function animaMenu() {
        linha1.animate({d: 'M25.2,3.9H0.8C0.4,3.9,0,3.5,0,3.1V0.8C0,0.4,0.4,0,0.8,0h24.4C25.6,0,26,0.4,26,0.8v2.3C26,3.5,25.6,3.9,25.2,3.9z'}, 200)
        linha2.animate({d: 'M25.2,12.3H0.8c-0.5,0-0.8-0.4-0.8-0.8V9.2c0-0.5,0.4-0.8,0.8-0.8h24.4c0.5,0,0.8,0.4,0.8,0.8v2.3C26,11.9,25.6,12.3,25.2,12.3z'}, 200)
        linha3.animate({d: 'M25.2,20.7H0.8c-0.5,0-0.8-0.4-0.8-0.8v-2.3c0-0.5,0.4-0.8,0.8-0.8h24.4c0.5,0,0.8,0.4,0.8,0.8v2.3C26,20.3,25.6,20.7,25.2,20.7z'}, 200)
      }

      var menu = document.querySelector('.topo span.menu');

      menu.onclick = function() {
        var className = 'ativo';
        var el = this.parentNode.parentNode;
        var ativo = false;

        // toggle
        if (el.classList) {
          el.classList.toggle(className);
        } else {
          var classes = el.className.split(' ');
          var existingIndex = classes.indexOf(className);

          if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
          else
            classes.push(className);

          el.className = classes.join(' ');
        }

        // animações
        if (el.classList) {
          if(el.classList.contains(className))
            animaFechar();
          else {
            animaMenu();
          }
        } else {
          if (new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className))
            animaFechar();
          else {
            animaMenu();
          }
        }
      }

    }

    // toggle
    if (document.querySelector('.topo .conta') != null) {

      if (size.indexOf("medium") !=-1 || size.indexOf("large") !=-1) {
        var dropsUser = document.querySelectorAll('.topo .conta > a, .topo .carrinho > a');

        Array.prototype.forEach.call(dropsUser, function(el, i){
          el.addEventListener('click', function(e){
            var menuUser = this.parentNode;
            var className = 'ativo';
            var classeConta = 'conta';
            var classeCarrinho = 'carrinho';

            // checando se é menu carrinho ou conta, retirando a classe do outro aberto
            if (menuUser.classList) {
              if (menuUser.classList.contains(classeCarrinho)) {
                document.querySelector('.topo .conta').classList.remove(className);
              } else {
                document.querySelector('.topo .carrinho').classList.remove(className);
              }
            } else {
              if (new RegExp('(^| )' + classeCarrinho + '( |$)', 'gi').test(menuUser.classeCarrinho)) {
                document.querySelector('.topo .conta').className = document.querySelector('.topo .conta').className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
              } else {
                document.querySelector('.topo .carrinho').className = document.querySelector('.topo .carrinho').className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
              }
            }

            if (menuUser.classList) {
              menuUser.classList.toggle(className);
            } else {
              var classes = menuUser.className.split(' ');
              var existingIndex = classes.indexOf(className);

              if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
              else
                classes.push(className);

              menuUser.className = classes.join(' ');
            }

            e.preventDefault();
          });
        });
      }

    }

  // Swiper
  var destaquePrincipal = new Swiper ('.destaque.swiper-container', {
    loop: true,
    autoplay: 4000,
    speed: 450,
    pagination: '.destaque.swiper-container .swiper-pagination',
    paginationClickable: true
  });

  var marcas = new Swiper ('.marcas.swiper-container', {
    loop: true,
    autoplay: 5000,
    slidesPerView: qntMarcas,
    slidesPerGroup: qntMarcas
  });

    if (document.querySelector('.marcas.swiper-container') != null) {
      document.querySelector('.marcas.swiper-container .anterior').addEventListener('click', function() { marcas.slidePrev(); });
      document.querySelector('.marcas.swiper-container .seguinte').addEventListener('click', function() { marcas.slideNext(); });
    }

  var galeriasProdutos = document.querySelectorAll('.produtos.swiper-container');
  var galeriaProduto1 = galeriasProdutos[0];
  var galeriaProduto2 = galeriasProdutos[1];

  Array.prototype.forEach.call(galeriasProdutos, function(el, i){
    if (el.classList)
      el.classList.add('s'+ i);
    else
      el.className += 's'+ i;
  });

  var produtos1 = new Swiper (galeriaProduto1, {
    loop: true,
    pagination: '.produtos.s0 .swiper-pagination',
    paginationClickable: true,
    slidesPerView: qntProdutos,
    slidesPerGroup: qntProdutos
  });

  var produtos2 = new Swiper (galeriaProduto2, {
    loop: true,
    pagination: '.produtos.s1 .swiper-pagination',
    paginationClickable: true,
    slidesPerView: qntProdutos,
    slidesPerGroup: qntProdutos
  });

    if (document.querySelector('.produtos.s0') != null) {
      document.querySelector('.produtos.s0 .anterior').addEventListener('click', function() { produtos1.slidePrev(); });
      document.querySelector('.produtos.s0 .seguinte').addEventListener('click', function() { produtos1.slideNext(); });
    }

    if (document.querySelector('.produtos.s1') != null) {
      document.querySelector('.produtos.s1 .anterior').addEventListener('click', function() { produtos2.slidePrev(); });
      document.querySelector('.produtos.s1 .seguinte').addEventListener('click', function() { produtos2.slideNext(); });
    }


  // Coluna

    // Navegação para telas pequenas
    if (size.indexOf("geral") !=-1 && document.querySelector('aside.coluna h3') != null) {
      var titulos = document.querySelectorAll('aside.coluna h3 a');
      var className = 'ativo';
      Array.prototype.forEach.call(titulos, function(el, i){
        var lista = el.parentNode.nextElementSibling;

        el.addEventListener('click', function(e){
          if (this.parentNode.classList) {
            this.parentNode.classList.toggle(className);
          } else {
            var classes = this.parentNode.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
              classes.splice(existingIndex, 1);
            else
              classes.push(className);

            this.parentNode.className = classes.join(' ');
          }

          if (lista.classList) {
            lista.classList.toggle(className);
          } else {
            var classes = lista.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
              classes.splice(existingIndex, 1);
            else
              classes.push(className);

            lista.className = classes.join(' ');
          }

          e.preventDefault();
        });
      });
    }


  // Produto

    // Galeria
    var linkAmpliada = document.querySelector('.detalhes-produto .imagem > a');

    var galeriaInterna = new Swiper ('.detalhes-produto .imagem .swiper-container', {
      loop: true,
      slidesPerView: qntThumbs,
      slideToClickedSlide: true,
      onSlideChangeEnd: function(){
        var source = document.querySelector('.detalhes-produto .imagem .swiper-slide-active a').getAttribute('data-image');
        var zoom = document.querySelector('.detalhes-produto .imagem .swiper-slide-active a').getAttribute('data-zoom-image');
        var imagem = document.querySelector('.detalhes-produto .imagem #ampliada');
        linkAmpliada.setAttribute('href', zoom);

        if (size.indexOf("geral") !=-1 || size.indexOf("medium") !=-1) {
          imagem.setAttribute('src', source);
        }
      }
    });

    if (document.querySelector('.detalhes-produto .imagem .swiper-container') != null) {
      document.querySelector('.detalhes-produto .imagem .swiper-container .anterior').addEventListener('click', function() { galeriaInterna.slidePrev(); });
      document.querySelector('.detalhes-produto .imagem .swiper-container .seguinte').addEventListener('click', function() { galeriaInterna.slideNext(); });

      var thumbs = document.querySelectorAll('.detalhes-produto .imagem .swiper-container a');
      Array.prototype.forEach.call(thumbs, function(el, i){
        el.addEventListener('click', function(e){
          e.preventDefault();
        });
      });
    }

    // Indique
    if (document.querySelector('a.indique') != null) {
      var indique = document.querySelectorAll('a.indique');
      Array.prototype.forEach.call(indique, function(el, i){
        el.addEventListener('click', function(e){
          var className = 'ativo';

          if (this.nextElementSibling.classList) {
            this.nextElementSibling.classList.toggle(className);
          } else {
            var classes = this.nextElementSibling.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
              classes.splice(existingIndex, 1);
            else
              classes.push(className);

            this.nextElementSibling.className = classes.join(' ');
          }

          e.preventDefault();
        })
      });
    }

    // Fechar
    if (document.querySelector('a.fechar') != null) {
      var fechar = document.querySelectorAll('a.fechar');
      Array.prototype.forEach.call(fechar, function(el, i){
        el.addEventListener('click', function(e){
          var ativo = document.querySelectorAll('.dropdown.ativo');

          Array.prototype.forEach.call(ativo, function(el, i){
            var className = 'ativo';
            
            if (el.classList)
              el.classList.remove(className);
            else
              el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
          });

          e.preventDefault();
        })
      });
    }

    // CEP
    if (document.querySelector('.cep .resultado') != null) {
      var botoesCep = document.querySelectorAll('.cep form button');
      var className = 'ativo';

      Array.prototype.forEach.call(botoesCep, function(el, i){
        var resultado = el.parentNode.parentNode.parentNode.nextElementSibling;

        el.addEventListener('click', function(e){
          if (resultado.classList)
            resultado.classList.add(className);
          else
            resultado.className += ' ' + className;

          e.preventDefault();
        });
      });
    }


  // jQuery

  $(document).ready(function(){

    $('html').removeClass('no-js').addClass('js');

    if (size.indexOf("large") !=-1){

      // Galeria de imagens com zoom
      $("#ampliada").ezPlus({
        borderSize: 1, borderColour: '#E2E2E2', zoomWindowOffsetY: -3.5, zoomWindowOffsetX: 30,
        gallery: 'galeria', cursor: 'pointer', galleryActiveClass: 'active', imageCrossfade: true, loadingIcon: 'imagens/loading.gif'
      });

    }

    $('.detalhes-produto .imagem > a').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      }
    });

    // Mostrar senha
    $('form #mostrar-senha').on('change', function(){
      $('input.pwd', $(this).parents('form')).hideShowPassword($(this).is(':checked'));
    });

  });


})();
