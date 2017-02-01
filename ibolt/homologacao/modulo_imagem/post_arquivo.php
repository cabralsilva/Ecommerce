<?php
// Configura o tempo limite para ilimitado
set_time_limit(0);

/*-----------------------------------------------------------------------------*
 * Parte 1: Configura├د├╡es do Envio de arquivos via FTP com PHP
/*----------------------------------------------------------------------------*/
session_start();
$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
$senha_ftp        = $_SESSION["s_senha_ftp"]; 
$pasta_ftp        = $_SESSION["s_pasta_ftp"]; 
$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";

	
$empresa_tmp = @$_SESSION["s_projeto_ftp"]."/";
$caminho = $_SESSION['s_caminho'];

//Extens├╡es de arquivos permitidas
$extensoes_autorizadas = array('.jpg');

/* 
Se quiser limitar o tamanho dos arquivo, basta colocar o tamanho m├ةximo 
em bytes. Zero ├ر ilimitado
*/
$limitar_tamanho = 0;

/* 
Qualquer valor diferente de 0 (zero) ou false, permite que o arquivo seja 
sobrescrito
*/
$sobrescrever = 0;

/*-----------------------------------------------------------------------------*
 * Parte 2: Configura├د├╡es do arquivo
/*----------------------------------------------------------------------------*/

// Verifica se o arquivo nao foi enviado. Se nao; termina o script.

/*if (!isset($_FILES['arquivo'])) {
	exit('Nenhum arquivo enviado!');
}*/

//Aqui o arquivo foi enviado e vamos configurar suas vari├ةveis
$arquivo = $_FILES['arquivo'];

//Nome do arquivo enviado
$nome_arquivo = $arquivo['name'];

//Tamanho do arquivo enviado
$tamanho_arquivo = $arquivo['size'];

//Nome do arquivo tempor├ةrio
$arquivo_temp = $arquivo['tmp_name'];

//Extensao do arquivo enviado
$extensao_arquivo = strrchr( $nome_arquivo, '.' );

//O destino para qual o arquivo ser├ة enviado
$conexao_ftp = ftp_connect( $servidor_ftp );

//Tenta fazer login
$login_ftp = @ftp_login( $conexao_ftp, $usuario_ftp, $senha_ftp );

$contents = ftp_nlist($conexao_ftp, "$caminho");
$total    = count($contents)+1;
$ini_img  = count($contents);
$nome     = substr($nome_arquivo, 0, -4);


$str    = "abcdefghijklmnopqrstuvxzABCDEFGHIJKLMNOPQRSTUVXZ";
$codigo = str_shuffle($str);
$tmp    = substr($codigo,0,1);


function tirarAcentosER($p_paramento){
		$p_paramento = str_replace(" ","_",$p_paramento);
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
		$p_paramento = str_replace("-","",$p_paramento);
		//$p_paramento = str_replace("/","",$p_paramento);
		$p_paramento = str_replace("'","",$p_paramento);
		$p_paramento = str_replace("´","",$p_paramento);
		$p_paramento = str_replace("`","",$p_paramento);
		$p_paramento = str_replace("^","",$p_paramento);
		$p_paramento = str_replace("~","",$p_paramento);
		$p_paramento = str_replace("!","",$p_paramento);
		$p_paramento = str_replace("@","",$p_paramento);
		$p_paramento = str_replace("#","",$p_paramento);
		$p_paramento = str_replace("$","",$p_paramento);
		$p_paramento = str_replace("%","",$p_paramento);
		$p_paramento = str_replace("¨","",$p_paramento);
		//$p_paramento = str_replace("&","",$p_paramento);
		$p_paramento = str_replace("*","",$p_paramento);
		$p_paramento = str_replace("(","",$p_paramento);
		$p_paramento = str_replace(")","",$p_paramento);
		$p_paramento = str_replace(";","",$p_paramento);
		$p_paramento = str_replace(":","",$p_paramento);
		$p_paramento = str_replace(",","",$p_paramento);
		$p_paramento = str_replace("\"","",$p_paramento);
		//$p_paramento = str_replace(".","",$p_paramento);
		//$p_paramento = str_replace("?","",$p_paramento);
		return $p_paramento;
	}


$nome_arquivo = tirarAcentosER($nome);

if($pasta_ftp == "produto"){
	$nome_arquivo = $nome_inicial_ftp.$total.".jpg";
	$destino = $caminho ."/".$nome_arquivo;
}else{
	//$destino = $caminho ."/". $tmp."".$nome_arquivo.".jpg";
	$destino = $caminho ."/".$nome_arquivo.".jpg";
}


/*-----------------------------------------------------------------------------*
 *  Parte 3: Verificações do arquivo enviado
/*----------------------------------------------------------------------------*/

/* 
Se a variavel $sobrescrever nao estiver configurada, assumimos que nao podemos 
sobrescrever o arquivo. Entao verificamos se o arquivo existe. Se existir; 
terminamos aqui. 
*/

if ( ! $sobrescrever && file_exists( $destino ) ) {
	exit('Arquivo ja existe.');
}

/* 
Se a vari├ةvel $limitar_tamanho tiver valor e o tamanho do arquivo enviado for
maior do que o tamanho limite, terminado aqui.
*/

if ( $limitar_tamanho && $limitar_tamanho < $tamanho_arquivo ) {
	exit('Arquivo muito grande.');
}

/* 
Se as $extensoes_autorizadas nao estiverem vazias e a extensao do arquivo nao 
estiver entre as extensoes autorizadas, terminamos aqui.
*/

if ( ! empty( $extensoes_autorizadas ) && ! in_array( $extensao_arquivo, $extensoes_autorizadas ) ) { ?>
	<!--<script>alert("Tipo de arquivo nao permitido.");</script>-->
    <meta http-equiv="refresh" content="0; URL=envia_arquivo.php">
<?php
exit;
}

/*-----------------------------------------------------------------------------*
* Parte 4: Conexao FTP
/*-----------------------------------------------------------------------------*/
// Realiza a conexao

// Tenta fazer login
$_conexao_ftp = ftp_connect( $servidor_ftp );
$login_ftp = @ftp_login( $_conexao_ftp, $usuario_ftp, $senha_ftp );

// Se nao conseguir fazer login, termina aqui
if ( ! $login_ftp ) {
	exit('Usuario ou senha FTP incorretos.');
}

// Envia o arquivo
//echo "-> ".$destino;

if ( @ftp_put( $conexao_ftp, $destino, $arquivo_temp, FTP_BINARY ) ) {
	// Se for enviado, mostra essa mensagem
?>
    <meta http-equiv="refresh" content="0; envia_arquivo.php">
<?php    
	ftp_close( $conexao_ftp );
} else {
	// Se nao for enviado, mostra essa mensagem
	echo 'Erro ao enviar arquivo!';
}
?>