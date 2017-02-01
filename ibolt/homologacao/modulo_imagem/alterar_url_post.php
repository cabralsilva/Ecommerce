<?php
session_start();
$link_ftp         = $_SESSION["s_link_ftp"]; 
$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
$senha_ftp        = $_SESSION["s_senha_ftp"]; 
$pasta_ftp        = $_SESSION["s_pasta_ftp"]; 
$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";

//Realiza a conexão
$conexao_ftp = ftp_connect( $_SESSION['s_servidor_ftp'] ) ;

//Tenta fazer login
$login_ftp = @ftp_login( $conexao_ftp, $_SESSION['s_usuario_ftp'], $_SESSION['s_senha_ftp'] ) ;

$pasta_ftp     = $_SESSION["s_pasta_ftp"]; 
$sub_pasta_ftp = $_SESSION["s_sub_pasta_ftp"]; 

$url_old     = $_SESSION["s_pasta_ftp"]."/".$_SESSION["s_sub_pasta_ftp"]."/".$_REQUEST['url_old'];
$url_new     = $_REQUEST['url_new'];

$p_paramento = str_replace($pasta_ftp,     "", $pasta_ftp);
$p_paramento = str_replace($sub_pasta_ftp, "", $sub_pasta_ftp);

$p_paramento = str_replace(".","-",$url_new);
$p_paramento = str_replace("/","|",$p_paramento);
$p_paramento = str_replace("%","_p_",$p_paramento);

$url_new     = str_replace("?","+",$p_paramento);

$caminho = $pasta_ftp."/".$sub_pasta_ftp."/";

/********************************************/
$str = "abcdefghijklmnopqrstuvxzABCDEFGHIJKLMNOPQRSTUVXZ";
$codigo = str_shuffle($str);
$ordenador_tmp = substr($codigo,0,1);
$url_new = $ordenador_tmp."_".$url_new.".jpg";	
/********************************************/

$url_new = $caminho.$url_new;	
//echo $url_new;
//echo "<br>".$url_old;
//die;
//echo "".$url_new;
//echo "<p>".$url_old;
ftp_rename($conexao_ftp, $url_old, $url_new);
	
?>

<script>
	parent.window.location.href = "envia_arquivo.php";
	/*alert("URL alterada com sucesso");
	window.opener.location.href = "envia_arquivo.php";
	window.close();*/
</script>