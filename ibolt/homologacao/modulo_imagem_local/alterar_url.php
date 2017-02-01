<?php
  session_start();
  $pasta     = $_SESSION["s_pasta"]; 
  $sub_pasta = $_SESSION["s_sub_pasta"];
  
  $url = $_REQUEST['url'];
  $url = str_replace("plander",      "", $url);
  $url = str_replace($pasta,     "", $url);
  $url = str_replace($sub_pasta, "", $url);
  $url = str_replace("/", "", $url);
  
//  print_r($_REQUEST);
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
  window.close();
  window.opener.location.href = "envia_arquivo.php";
}
</script>
<body bgcolor="#FEFDED">
<form action="#" method="post" name="formulario">
<input type="hidden" value="<?=$_REQUEST['url']?>" name="url_old" style="width:100%">

<table width="99%" border="0" cellspacing="0" cellpadding="0" align="center">
  <tr>
    <td bgcolor="#EBEBEB"><b>URL</b></td>
    <td><input type="text" value="" name="url_new" style="width:100%"></td>
  </tr>
  <tr>
    <td colspan="2" align="center" height="50px">
      <input type="button" value="Confirma Nova URL" onClick="confirma()" style="cursor:pointer">
        &nbsp;&nbsp;&nbsp;
        <input type="button" value="Fechar Janela" onClick="fechar()" style="cursor:pointer">
    </td>
  </tr>
</table>
</form>