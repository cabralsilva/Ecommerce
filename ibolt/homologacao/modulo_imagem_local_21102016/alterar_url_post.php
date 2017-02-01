<?php
session_start(); 
 
$pasta       = $_SESSION["s_pasta"]; 
$sub_pasta    = $_SESSION["s_sub_pasta"]; 
$nome_inicial = $_SESSION["s_nome_inicial"]."_";

$pasta     = $_SESSION["s_pasta"]; 
$sub_pasta = $_SESSION["s_sub_pasta"]; 
$caminho = "../".$pasta."/".$sub_pasta."/";
$url_old     = $caminho.$_REQUEST['url_old'];
$url_new     = $_REQUEST['url_new'];

$p_paramento = str_replace($pasta,     "", $pasta);
$p_paramento = str_replace($sub_pasta, "", $sub_pasta);

$p_paramento = str_replace(".","-",$url_new);
$p_paramento = str_replace("/","|",$p_paramento);
$p_paramento = str_replace("%","_p_",$p_paramento);

$url_new     = str_replace("?","+",$p_paramento);



/********************************************/
$str = "abcdefghijklmnopqrstuvxzABCDEFGHIJKLMNOPQRSTUVXZ";
$codigo = str_shuffle($str);
$ordenador_tmp = substr($codigo,0,1);
$url_new = $ordenador_tmp."_".$url_new.".jpg";	
/********************************************/

$url_new = $caminho.$url_new;	
//echo "".$url_new;
//echo "<p>".$url_old;

rename($url_old, $url_new);	
?>

<script>
	alert("URL alterada com sucesso");
	window.opener.location.href = "envia_arquivo.php";
	window.close();
</script>