<?php
//precisa desse codigo pois senão as páginas nao encontram o css quando amigáveis
?>
<meta charset="utf-8" />
<title><?php if($_tituloPagina != "") echo $_tituloPagina; else echo $_tituloDescricao . " - " . TITLE; ?></title>
<meta name="description" content="<?php if($_descricaoPagina != "") echo $_descricaoPagina; else echo $_tituloDescricao; ?>" />
<meta name="keywords" content="<?php echo $_palavraChavePagina; ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="<?php echo URL_SSL; ?>humans.txt" rel="author" />
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic" rel="stylesheet">



<link href="<?php echo URL_SSL; ?>painel/resources/css/_bower.css?v=1" rel="stylesheet" />
<link href="<?php echo URL_SSL; ?>painel/resources/css/geral.css?v=1" rel="stylesheet" />
<link href="<?php echo URL_SSL; ?>painel/resources/css/impressao.css?v=1" rel="stylesheet" media="print" />
<script src="<?php echo URL_SSL; ?>painel/resources/bower_components/picturefill/dist/picturefill.min.js" async></script>

<link rel="icon" type="image/png" href="<?php echo URL_SSL; ?>imagens/favicon.png" />
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
