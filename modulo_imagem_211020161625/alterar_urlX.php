<?php
  session_start();
  $pasta_ftp     = $_SESSION["s_pasta_ftp"]; 
  $sub_pasta_ftp = $_SESSION["s_sub_pasta_ftp"];
  $url = $_REQUEST['url'];
  $url = str_replace("plander",      "", $url);
  $url = str_replace($pasta_ftp,     "", $url);
  $url = str_replace($sub_pasta_ftp, "", $url);
  $url = str_replace("/", "", $url);
  
//  echo "<pre>";
?>
<script>
function confirma(){
  f = document.formulario;
  if(f.url_new.value == ""){
    alert("Falta informar a URL");
    f.url_new.focus();
    return false;
  }
  f.action = 'alterar_url_post.php'; 
  f.submit();   
}

function fechar(){
  /*window.close();
  window.opener.location.href = "envia_arquivo.php";*/
  parent.window.location.href = "envia_arquivo.php";
}
</script>
<body bgcolor="#FEFDED">
<form action="#" method="post" name="formulario">
<input type="hidden" value="<?=$_REQUEST['url']?>" name="url_old" style="width:100%">

<table width="99%" border="0" cellspacing="0" cellpadding="0" align="center">
  <tr>
    <td bgcolor="#EBEBEB" width="10%"><b>URL</b></td>
    <td><input type="text" value="" name="url_new" style="width:100%"></td>
  </tr>
  <tr>
    <td colspan="2" align="center" height="50px">
      <input type="button" value="Confirma nova URL" onClick="confirma()" style="cursor:pointer">
        &nbsp;&nbsp;&nbsp;
        <input type="button" value="Cancelar" onClick="fechar()" style="cursor:pointer">
    </td>
  </tr>
</table>
</form>