<?php
//precisa desse codigo pois senão as páginas nao encontram o css quando amigáveis
?>
<meta charset="utf-8" />
<title><?php if($_tituloPagina != "") echo $_tituloPagina; else echo $_tituloDescricao . " - " . TITLE; ?></title>
<meta name="description" content="<?php if($_descricaoPagina != "") echo $_descricaoPagina; else echo $_tituloDescricao; ?>" />
<meta name="keywords" content="<?php echo $_palavraChavePagina; ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="<?php echo URL; ?>humans.txt" rel="author" />
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic" rel="stylesheet">
<link href="<?php echo URL; ?>css/_bower.css?v=1" rel="stylesheet" />
<link href="<?php echo URL; ?>css/geral.css?v=1" rel="stylesheet" />
<link href="<?php echo URL; ?>css/impressao.css?v=1" rel="stylesheet" media="print" />
<link rel="icon" type="image/png" href="<?php echo URL; ?>imagens/favicon.png" />
<script src="<?php echo URL; ?>bower_components/picturefill/dist/picturefill.min.js" async></script>