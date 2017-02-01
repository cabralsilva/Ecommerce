<?php
require_once("../actions/funcoes.php");
header("Pragma: no-cache");
header("Cache: no-cache");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 

	
/************************/

session_start(); 
// pasta onde o arquivo sera enviado, banner ou produto
$pasta        = $_SESSION["s_pasta"]; 
// subpasta onde o produto será enviado
$sub_pasta    = $_SESSION["s_sub_pasta"]; 
// nome inicial será sempre w
$nome_inicial = $_SESSION["s_nome_inicial"]."_";

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
		alert("Falta informar a Imagem para Upload.");
		f.arquivo.focus();
		return false;
	}else {
		/*var fileInput = document.getElementById("arquivo");
		var maxSize = $("#arquivo").data('max-size');
		var fileSize = fileInput.files[0].size; // in bytes
		if(fileSize>maxSize){
			alert("Tamanho do arquivo excede o limite máximo.");
			f.arquivo.focus();
			return false;
		}*/
	}
	if(document.getElementById("url") != null){
		if(document.getElementById("url").value == ""){
			alert("Falta informar a url.");
			document.getElementById("url").focus();
			return false;
		}
	}
  
  //f.action = 'post_arquivo.php'; 
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
	
	if(confirm('Confirma Exclusão ?')) {
		myForm.submit();	
	}		
  }    
}  
   
</script>
</head>

<body bgcolor="#FEFDED">
<form action="post_arquivo.php" method="post" name="formulario" enctype="multipart/form-data">
    <b>Arquivo Externo:</b>
    <input id="arquivo" type="file" name="arquivo" required="required" data-max-size="450000">
    <?php if($pasta == "banners") {?>
    	<p>
	    	<b>Url:</b>
	    	<input type="text" id="url" name="url" style="width: 40%;" required="required"><input type="button" value="Enviar" onclick="upload()">
	    </p>
    <?php } else {?>
    	<input type="button" value="Enviar" onclick="upload()">
    <?php } ?>
    
    
    <!--<a href="index.php">Encerrar</a>-->
</form>

<?php	
// caminho completo onde o arquivo será enviado
$diretorio = "../".$pasta."/".$sub_pasta;	
// scandir lista o diretorio
$contents = scandir($diretorio);				           
?>               
<div id="divOP"></div>
<?php	
		
	echo "<div style=\"padding:10px 10px; border-top:2px solid #DDDDDD;\">";
	echo "<style>
				.sortable { list-style:none; margin:0; padding:0;  }
				.sortable li { float:left; margin:20px;  width:225px; height:124px; cursor:move; }
		</style>";

	echo "<ul id=\"sortable_banner\" class=\"sortable\">";
	$total = count($contents);
	
	for ($_i=0; $_i<$total; $_i++){
      // != '.' e '..' faz exibir somente as imagens e não diretorios
	  if ($contents[$_i] != '.' && $contents[$_i] != '..'){
      
	  echo "<li class=\"ui-state-default\" id=\"" .($contents[$_i]) . "\">";
	  
	  if($pasta == "banners") {
	  	$tool_tip   = decodeNameImageUrl($contents[$_i]);
		$tool_tip   = str_replace(".jpg","",$tool_tip);
		$tool_tip   = substr($tool_tip,2);

		$tool_tip   = str_replace("//","",$tool_tip);           
		$tool_tip   = str_replace('http',  '', $tool_tip); 
		$tool_tip   = str_replace('https', '', $tool_tip);
		$tool_tip   = str_replace(':', '', $tool_tip); 
		$tool_tip = "http://" . $tool_tip;
		echo "<img height='120px' width='250px' title=\"$tool_tip\" style=\"float:left; border:2px solid #CCCCCC;\" src='$diretorio/$contents[$_i]'?" . time() .">";
	  } else {
	  	echo "<img height='120px' width='250px' style=\"float:left; border:2px solid #CCCCCC;\" src='$diretorio/$contents[$_i]?" . time() ."'>";
	  }
	  echo "<p><hr>";
	
?>
      &nbsp;
      <!--a href="#" onclick="excluir_imagem('< ?=$contents[$_i]?>')"><img style="float:left; border:0px;" src='remover.png' width="25px" height="25px" title="Excluir a Imagem"/></a-->   
      <a href="#" onclick="sendPost('remove.php',{remove:'<?=$contents[$_i]?>'});"><img style="float:left; border:0px;" src='remover.png' width="25px" height="25px" title="Excluir a Imagem"/></a>
                     
			<?php if($pasta == "banners") {?>
            	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <?php $link_img = str_replace("&","-",$contents[$_i]);?> 
                  <!--<a href="javascript:openPopupPage('alterar_url.php','<?=$contents[$_i]?>')"><img src="editar_url.jpg" title="Inserir URL" width="25px" height="25px"/></a>-->

            <?php }
			
	
	        ?>            
            
	    <?php    		
	  echo "<p>&nbsp;</p>";
	  echo "</li>";
	  }
	}

	echo "<div style=\"clear:both\"></div>";
	echo "</ul>";
	
	echo "<script> $('#sortable_banner').sortable({
	stop: function(event, ui) {
			$('#divOP').load('reordena_imagem.php?dir=$pasta&inicio_nome_foto=$nome_inicial', { 'ordem': $('#sortable_banner').sortable('toArray') } )						
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