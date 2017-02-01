<?php
	require_once("../class/imagem.class.php");
	
	header("Content-type: image/jpeg");	

	if(file_exists($_GET["local"]))
		$_local = $_GET["local"];
	else
		$_local = "../imagens/logo_erro.jpg";
	
	if(isset($_GET['l']))
		$largura = $_GET['l'];
	else
		$largura = NULL;
	
	if(isset($_GET['a']))
		$altura = $_GET['a'];
	else
		$altura = NULL;
	
	if(isset($_GET['f']))
		$fundo = $_GET['f'];
	else
		$fundo = 0;
	
	$img = new Imagem($_local);
	$img->redimensionar($largura,$altura,$fundo);
	
	if(@isset($_GET["contraste"]))
		$img->filter("contraste", $_GET["contraste"]);
	
	if(@isset($_GET['logo']))
		$img->colocaLogo(@$_GET['logo'], 70);
	
	$img->show();

?>
