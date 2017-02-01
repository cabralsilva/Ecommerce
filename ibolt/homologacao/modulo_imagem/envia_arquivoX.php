<?php
header("Pragma: no-cache");
header("Cache: no-cache");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
	
/************************/
session_start();
$link_ftp         = $_SESSION["s_link_ftp"]; 
$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
$senha_ftp        = $_SESSION["s_senha_ftp"]; 
$pasta_ftp        = $_SESSION["s_pasta_ftp"]; 
$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";

//Realiza a conexão
$conexao_ftp = ftp_connect( $_SESSION['s_servidor_ftp'] );

//Tenta fazer login
$login_ftp = @ftp_login( $conexao_ftp, $_SESSION['s_usuario_ftp'], $_SESSION['s_senha_ftp'] );	
if($login_ftp){
//echo "ok";
}else{

	//echo "erro";
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload de Arquivos</title>
<script src="js/jquery-1.7.2.js"></script>
<script src="js/jquery-ui-1.8.22.js"></script>
<script src="js/jquery.dialogextend.js"></script>

<script>
function upload(){
  f = document.formulario;
  if(f.arquivo.value == ""){
    alert("Falta informar a imagem para upload.");
    f.arquivo.focus();
    return false;
  }
  f.action = 'post_arquivo.php'; 
  f.submit();  	
}
/*
function abrir(URL) {
	var width  = 700;
	var height = 300;		 
	var left   = 250;
	var top    = 100;		 
	window.open(URL,'janela', 'width='+width+', height='+height+', top='+top+', left='+left+', scrollbars=yes, status=no, toolbar=no, location=no, directories=no, menubar=no, resizable=no, fullscreen=no');     
}
*/
function openPopupPage(relativeUrl, url) {
  var param = { 'url' : url};
  OpenWindowWithPost(relativeUrl, "width=1000, height=600, left=100, top=100, resizable=yes, scrollbars=yes", "NewFile", param);
}
  
function OpenWindowWithPost(url, windowoption, name, params){
 var form = document.createElement("form");
 form.setAttribute("method", "post");
 form.setAttribute("action", url);
 form.setAttribute("target", name);
 for (var i in params)
 {
   if (params.hasOwnProperty(i))
   {
     var input = document.createElement('input');
     input.type = 'hidden';
     input.name = i;
     input.value = params[i];
     form.appendChild(input);
   }
 }
 document.body.appendChild(form);
 window.open("alterar_url.php", name, windowoption);
 form.submit();
 document.body.removeChild(form);
}



//EXCLUI A IMAGEM
if(!window.sendPost){
  window.sendPost = function(url, obj){
	//Define o formulário
	var myForm = document.createElement("form");
	myForm.action = url;
	myForm.method = "post";

	for(var key in obj) {
		 var input = document.createElement("input");
		 input.type = "hidden";
		 input.value = obj[key];
		 input.name = key;
		 myForm.appendChild(input);            
	}
	//Adiciona o form ao corpo do documento
	document.body.appendChild(myForm);
	//Envia o formulário
	
	if(confirm('Confirma exclusão ?')) {
		myForm.submit();	
	}		
  }    
}  
   
</script>
</head>

<body bgcolor="#FEFDED">
<form action="#" method="post" name="formulario" enctype="multipart/form-data">
    <b>Arquivo Externo:</b><input type="file" name="arquivo">
    <input type="button" value="Enviar" onclick="upload()">    
</form>

<?php
	//echo $_SESSION['s_caminho'];

	//$caminho = @$link_ftp.$_SESSION['s_caminho'];	
	//$contents = ftp_nlist($conexao_ftp, "{$_SESSION['s_caminho']}");
	//sort($contents);
	//$total = count($contents);			


	$caminho = @$link_ftp.$_SESSION['s_caminho'];	
	$_caminho = $_SESSION['s_caminho']."/";

    //ftp_chdir($conexao_ftp, "{$_caminho}");
    //$xx = $link_ftp."/produtos/1000190000193";
	//$contents = ftp_nlist($conexao_ftp, "{$_caminho}");
	//echo "cami ".$_caminho;

    $contents = ftp_nlist($conexao_ftp, "{$_caminho}");
	//$contents =  ftp_nlist($conn_id, "-la /your/dir");
	sort($contents);

   $contents = array_slice($contents, 2);

   //echo "<pre>";
   //var_dump($contents);

	$total = count($contents);	

?>               
<div id="divOP"></div>
<?php	
echo "<div style=\"padding:10px 10px; border-top:2px solid #DDDDDD;\">";		

echo "<style>
		.sortable { list-style:none; margin:0; padding:0;  }
		.sortable li { float:left; margin:20px;  width:225px; height:124px; cursor:move; }
</style>";

echo "<ul id=\"sortable_banner\" class=\"sortable\">";
	
	
	for ($_i=0; $_i<$total; $_i++){
    
	
	//if(ftp_size($conexao_ftp, $contents[$_i]) != '-1'){

	echo "<li class=\"ui-state-default\" id=\"" . ($contents[$_i]) . "\">";
			echo "<img height='120px' width='250px' style=\"float:left; border:2px solid #CCCCCC;\" src='$link_ftp/$contents[$_i]'>";
		echo "<p><hr>";

		?>
        	&nbsp;
            <!--a href="#" onclick="excluir_imagem('< ?=$contents[$_i]?>')"><img style="float:left; border:0px;" src='remover.png' width="25px" height="25px" title="Excluir a Imagem"/></a-->   
            <a href="#" onclick="sendPost('remove_banner.php',{remove:'<?=$contents[$_i]?>'});"><img style="float:left; border:0px;" src='remover.png' width="25px" height="25px" title="Excluir a Imagem"/></a>
                     
			<?php if($pasta_ftp == "banners") {?>
            	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <?php  $link_img = str_replace("&","-",$contents[$_i]);?> 
                <!--<a href="javascript:openPopupPage('alterar_url.php','<?//=$contents[$_i]?>')"><img src="editar_url.jpg" title="Inserir URL" width="25px" height="25px"/></a>-->
                <a href="alterar_url.php?url=<?=$contents[$_i]?>"><img src="editar_url.jpg" title="Inserir URL" width="25px" height="25px"/></a>

            <?php } ?>            
            
	    <?php    		
	echo "<p>&nbsp;</p>";
	echo "</li>";
} //}


	echo "<div style=\"clear:both\"></div>";
	echo "</ul>";
	
	echo "<script> $('#sortable_banner').sortable({
	stop: function(event, ui) {
			$('#divOP').load('reordena_imagem.php?dir=$pasta_ftp&inicio_nome_foto=$nome_inicial_ftp', { 'ordem': $('#sortable_banner').sortable('toArray') } )						
		}
	});
	$('#sortable_banner').disableSelection();

	///$(location).attr('href', 'envia_arquivo.php');
	</script>";
echo "</div>";

?>

</body>
</html> 


<pre>
<?php
//print_r($_SESSION);
?>