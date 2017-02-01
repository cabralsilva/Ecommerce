<?php
	session_start();
	
	unset($_SESSION['s_pasta']);
	unset($_SESSION['s_sub_pasta']);	
	unset($_SESSION["s_nome_inicial"]);
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
<!-- form action="renomeia.php" method="post" name="formulario" -->
<form action="#" method="post" name="formulario">

    <p>link_ftp:<input type="text" name="link_ftp" value="http://ibolt.com.br/" style="width:20%">
    <p>EMPRESA:<input type="text" name="projeto_ftp" value="ibolt">obs: Apenas enquanto estiver na locaWeb

    <p>servidor_ftp:<input type="text" name="servidor_ftp" value="ftp.ibolt.com.br">
    <p>usuario_ftp:<input type="text" name="usuario_ftp" value="lucas">
    <p>senha_ftp:<input type="text" name="senha_ftp" value="ftp@123">
    <p>pasta_ftp:
    <select name="pasta">
        <option value="produtos" selected="selected">produtos</option>
        <option value="banners">banners</option>
    </select>
    <p>sub_pasta:<input type="text" name="sub_pasta" value="1000190000193"><p>
    
    <p>
    <hr>
    <b>OBRIGATÓRIO SE FOR PRODUTO</b>
    <p>nome_inicial:<input type="text" name="nome_inicial" value="w">
        
    <!--b>
    	Banner<input type="radio" name="tipo" value="0">
    	&nbsp;&nbsp;&nbsp;&nbsp;
    	Produto<input type="radio" name="tipo" value="1">
    </b-->
    
    <p>
    0000100000108<br>
    0000110000112<br>
    0000120000126
	<p>
    <input type="button" value="Confirma" onclick="inicia()">
    
    <hr>
    <b>produto:</b> projeto_ftp / pasta_ftp / sub_pasta_ftp<br>
    <b>banner:</b> projeto_ftp / pasta_ftp
</form>


<pre>
<?php
print_r($_SESSION);
?>