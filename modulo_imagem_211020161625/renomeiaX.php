<?php
	@session_start();
	
	/*
		unset($_SESSION['s_servidor_ftp']);
		unset($_SESSION['s_usuario_ftp']);
		unset($_SESSION['s_senha_ftp']);
		unset($_SESSION['s_projeto_ftp']);
		unset($_SESSION['s_pasta_ftp']);
		unset($_SESSION['s_sub_pasta_ftp']);	
		unset($_SESSION["s_nome_inicial_ftp"]);
		unset($_SESSION["s_link_ftp"]);
	*/
	
	function tirarAcentosER($p_paramento){
		$p_paramento = str_replace("á","a",$p_paramento);
		$p_paramento = str_replace("à","a",$p_paramento);
		$p_paramento = str_replace("ã","a",$p_paramento);
		$p_paramento = str_replace("é","e",$p_paramento);
		$p_paramento = str_replace("ê","e",$p_paramento);
		$p_paramento = str_replace("í","i",$p_paramento);
		$p_paramento = str_replace("ó","o",$p_paramento);
		$p_paramento = str_replace("ô","o",$p_paramento);
		$p_paramento = str_replace("õ","o",$p_paramento);
		$p_paramento = str_replace("ú","u",$p_paramento);
		$p_paramento = str_replace("ç","c",$p_paramento);
		$p_paramento = str_replace("Á","A",$p_paramento);
		$p_paramento = str_replace("À","A",$p_paramento);
		$p_paramento = str_replace("Ã","A",$p_paramento);
		$p_paramento = str_replace("É","E",$p_paramento);
		$p_paramento = str_replace("Ê","E",$p_paramento);
		$p_paramento = str_replace("Í","I",$p_paramento);
		$p_paramento = str_replace("Ó","O",$p_paramento);
		$p_paramento = str_replace("Ô","O",$p_paramento);
		$p_paramento = str_replace("Õ","O",$p_paramento);
		$p_paramento = str_replace("Ú","U",$p_paramento);
		$p_paramento = str_replace("Ç","C",$p_paramento);
		return $p_paramento;
	} 


	function tirarAcentosER2($p_paramento){
		$p_paramento = str_replace("-","",$p_paramento);
		$p_paramento = str_replace(" _ ","",$p_paramento);
		$p_paramento = str_replace("/","",$p_paramento);
		$p_paramento = str_replace("'","",$p_paramento);
		$p_paramento = str_replace("´","",$p_paramento);
		$p_paramento = str_replace("`","",$p_paramento);
		$p_paramento = str_replace("^","",$p_paramento);
		$p_paramento = str_replace("~","",$p_paramento);
		$p_paramento = str_replace(" ","_",$p_paramento);
		$p_paramento = str_replace(" - ","",$p_paramento);
		$p_paramento = str_replace(" / ","",$p_paramento);
		$p_paramento = str_replace(" ' ","",$p_paramento);
		$p_paramento = str_replace(" ´ ","",$p_paramento);
		$p_paramento = str_replace(" ` ","",$p_paramento);
		$p_paramento = str_replace(" ^ ","",$p_paramento);
		$p_paramento = str_replace(" ~ ","",$p_paramento);
		$p_paramento = str_replace("@","",$p_paramento);
		$p_paramento = str_replace("$","",$p_paramento);
		$p_paramento = str_replace("\"","",$p_paramento);
		//$p_paramento = str_replace(",","",$p_paramento);
		return $p_paramento;
	}



	$_SESSION["s_link_ftp"]         = $_REQUEST['link_ftp']; 
	$_SESSION["s_servidor_ftp"]     = $_REQUEST['servidor_ftp']; 
	$_SESSION["s_usuario_ftp"]      = $_REQUEST['usuario_ftp']; 
	$_SESSION["s_senha_ftp"]        = $_REQUEST['senha_ftp']; 
	$_SESSION["s_projeto_ftp"]      = $_REQUEST['projeto_ftp']; 
	$_SESSION["s_pasta_ftp"]        = $_REQUEST['pasta_ftp']; 
	$_SESSION["s_sub_pasta_ftp"]    = $_REQUEST['sub_pasta_ftp']; 

    $xx = tirarAcentosER($_REQUEST['nome_inicial_ftp']); 
    $_SESSION["s_nome_inicial_ftp"] = tirarAcentosER2($xx); 

	
	$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
	$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
	$senha_ftp        = $_SESSION["s_senha_ftp"]; 
	$empresa          = $_SESSION["s_projeto_ftp"]; 
	$pasta_ftp        = $_SESSION["s_pasta_ftp"]; //produto  || banner
	$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
	$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";
	
	$caminho = $pasta_ftp."/".$sub_pasta_ftp;
	$_SESSION['s_caminho'] = $caminho;
	
	//echo "<pre>";
	//print_r($_SESSION);	
	//exit; - 
//Realiza a conexão
$conexao_ftp = ftp_connect( $servidor_ftp );

//Tenta fazer login
$login_ftp = ftp_login( $conexao_ftp, $usuario_ftp, $senha_ftp );

if (@ftp_mkdir($conexao_ftp, "$pasta_ftp/$sub_pasta_ftp/")) {
 //echo "criado com sucesso o diretório: $sub_pasta_ftp\n";
} else {
 //echo "erro na criação do diretório: $sub_pasta_ftp\n";
}

header("Location: envia_arquivo.php");	
?>