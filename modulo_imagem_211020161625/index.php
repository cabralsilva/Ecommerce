<?php
	session_start();
	unset($_SESSION['s_servidor_ftp']);
	unset($_SESSION['s_usuario_ftp']);
	unset($_SESSION['s_senha_ftp']);
	unset($_SESSION['s_projeto_ftp']);
	unset($_SESSION['s_pasta_ftp']);
	unset($_SESSION['s_sub_pasta_ftp']);	
	unset($_SESSION["s_nome_inicial_ftp"]);
	unset($_SESSION["s_link_ftp"]);
    unset($_SESSION["s_caminho"]);
	session_destroy();
?>
<script>
function inicia(){
   f = document.formulario;
   f.action = 'renomeia.php';
	 f.submit();
}
</script>

<form action="#" method="post" name="formulario">

    <p>link_ftp:<input type="text" name="link_ftp" value="http://plander.com.br" style="width:20%">
    <p>EMPRESA:<input type="text" name="projeto_ftp" value="plander"> Tirar esse parâmetro pois não é usado

    <p>servidor_ftp:<input type="text" name="servidor_ftp" value="ftp.plander.com.br">
    <p>usuario_ftp:<input type="text" name="usuario_ftp" value="plander2">
    <p>senha_ftp:<input type="text" name="senha_ftp" value="pdr987">
    <p>pasta_ftp:
    <select name="pasta_ftp">
        <option value="produtos" selected="selected">produtos</option>
        <option value="banners">banners</option>
    </select>
    <p>sub_pasta_ftp:<input type="text" name="sub_pasta_ftp" value="lucas"><p>
    
    <p>
    <hr>
    <b>OBRIGATORIO PARA PRODUTOS - NOME DO PRODUTO</b>
    <p>nome_inicial_ftp:<input type="text" name="nome_inicial_ftp" value="w">
    
    <hr>
    <input type="button" value="Confirma" onclick="inicia()">
    
</form>