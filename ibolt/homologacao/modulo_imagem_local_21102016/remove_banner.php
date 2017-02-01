<?php
/************************/
session_start();
$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
$senha_ftp        = $_SESSION["s_senha_ftp"]; 
$projeto_ftp      = $_SESSION["s_projeto_ftp"]; 
$pasta_ftp        = $_SESSION["s_pasta_ftp"]; 
$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";

@unlink($_REQUEST["remove"]);
//print_r($_REQUEST);

//Define a conexão básica
$conn_id = ftp_connect($servidor_ftp);

//login com nome de usuário e senha
$login_result = ftp_login($conn_id, $usuario_ftp, $senha_ftp);

//tenta excluir $file
// codigo antigo  if (ftp_delete($conn_id, $_REQUEST["remove"])) {
   if(unlink($_REQUEST["remove"])){
   //echo "O arquivo '".$_REQUEST["remove"]."' foi excluído\n";
} else {
   //echo "não foi possível excluir '".$_REQUEST["remove"]."'\n";
}

// fecha a conexão
ftp_close($conn_id);

header("Location: envia_arquivo.php");
print_r($_REQUEST);
?>