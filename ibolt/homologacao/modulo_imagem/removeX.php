<?php
session_start();
$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
$senha_ftp        = $_SESSION["s_senha_ftp"]; 
$projeto_ftp      = $_SESSION["s_projeto_ftp"]; 
$pasta_ftp        = $_SESSION["s_pasta_ftp"]; 
$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";

// Realiza a conexão
$conexao_ftp = ftp_connect( $servidor_ftp );

// Tenta fazer login
$login_ftp = @ftp_login( $conexao_ftp, $usuario_ftp, $senha_ftp );

$contents = ftp_nlist($conexao_ftp, "$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/");	
$total_arquivos_pasta = count($contents);

$remove  = $_REQUEST['remove'];

$file = "$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$remove";
if (ftp_delete($conexao_ftp, $file)) {
   echo "O arquivo $file foi excluído\n";
} else {
   echo "não foi possível excluir $file\n";
}

	$tmp_w_ = date("YmdHi");
	for ($_i=1; $_i<=$total_arquivos_pasta; $_i++){
		$old_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$nome_inicial_ftp".$_i.".jpg";  
		//$j = $_i+1;
		$new_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$tmp_w_".$_i.".jpg";  
		@ftp_rename($conexao_ftp, $old_file, $new_file);
	}
	
	for ($_i=1; $_i<=$total_arquivos_pasta; $_i++){
		$old_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$nome_inicial_ftp".$_i.".jpg";  
		//$j = $_i+1;
		$new_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$tmp_w_".$_i.".jpg";  
		@ftp_rename($conexao_ftp, $old_file, $new_file);
	}
	
	$contents = ftp_nlist($conexao_ftp, "$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/");	
	$totala = count($contents);
	for($x=0; $x<$totala; $x++){
		$nome_tmp = $contents[$x];
		$_i = $x + 1;
		$old_file = $nome_tmp;  
		//$j = $_i+1;
		$new_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$nome_inicial_ftp".$_i.".jpg";  
		@ftp_rename($conexao_ftp, $old_file, $new_file);
	}
	
	header("Location: envia_arquivo.php");
?>

<?php
exit;
/*

/************************
session_start();
$servidor_ftp  = (@$_REQUEST['servidor_ftp'] == "")  ? $_SESSION["s_servidor_ftp"] :  $_REQUEST['servidor_ftp']; 
$usuario_ftp   = (@$_REQUEST['usuario_ftp'] == "")   ? $_SESSION["s_usuario_ftp"] :   $_REQUEST['usuario_ftp']; 
$senha_ftp     = (@$_REQUEST['senha_ftp'] == "")     ? $_SESSION["s_senha_ftp"] :     $_REQUEST['senha_ftp']; 
$projeto_ftp   = (@$_REQUEST['projeto_ftp'] == "")   ? $_SESSION["s_projeto_ftp"] :   $_REQUEST['projeto_ftp']; 
$pasta_ftp     = (@$_REQUEST['pasta_ftp'] == "")     ? $_SESSION["s_pasta_ftp"] :     $_REQUEST['pasta_ftp']; 
$sub_pasta_ftp = (@$_REQUEST['sub_pasta_ftp'] == "") ? $_SESSION["s_sub_pasta_ftp"] : $_REQUEST['sub_pasta_ftp']; 


// Realiza a conexão
$conexao_ftp = ftp_connect( $servidor_ftp );

// Tenta fazer login
$login_ftpa = @ftp_login( $conexao_ftp, $usuario_ftp, $senha_ftp );
//$total=5;

print_r($_REQUEST);

$remove  = $_REQUEST['remove'];
//$caminho = "http://ibolt.com.br/projetos/walter/projeto_recebe_ordenacao_imagem/pasta_imagem/";
//ftp_delete($conexao_ftpa, $remove);

$contents = ftp_nlist($conexao_ftp, "$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/");	
echo "total: ".$total = count($contents);

$file = "$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/$remove";
if (ftp_delete($conexao_ftp, $file)) {
   echo "O arquivo $file foi excluído\n";
} else {
   echo "não foi possível excluir $file\n";
}

	
	for ($_i=1; $_i<=$total; $_i++){
		$old_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/w_".$_i.".jpg";  
		//$j = $_i+1;
		echo "&nbsp;&nbsp;&nbsp; ".$new_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/tmp_w_".$_i.".jpg";  
		ftp_rename($conexao_ftp, $old_file, $new_file);
	}
	
	for ($_i=1; $_i<=$total; $_i++){
		$old_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/w_".$_i.".jpg";  
		//$j = $_i+1;
		$new_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/tmp_w_".$_i.".jpg";  
		ftp_rename($conexao_ftp, $old_file, $new_file);
	}
	
	for($x=0; $x<$total; $x++){
		echo "<br>=====".$nome_tmp = $contents[$x];
		$_i = $x + 1;
		echo "OLD: ".$old_file = $nome_tmp;  
		//$j = $_i+1;
		echo "<br>NEW ".$new_file = "/$projeto_ftp/$pasta_ftp/$sub_pasta_ftp/w_".$_i.".jpg";  
		ftp_rename($conexao_ftp, $old_file, $new_file);
		echo "<p>";	
		echo "<p>";
	}
	
	echo "<p>";
	/*for ($_i=1; $_i<=$total; $_i++){
		$old_file = "/projeto_recebe_ordenacao_imagem/pasta_imagem_locaweb/tmp_w_".$_i.".jpg";  
		$j = $_i+1;
		echo "&nbsp;&nbsp;&nbsp; ".$new_file = "/projeto_recebe_ordenacao_imagem/pasta_imagem_locaweb/w_".$j.".jpg";  
		ftp_rename($conexao_ftp, $old_file, $new_file);
	}*/
?>