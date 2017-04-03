<?php
include '../util/constantes.php';
session_start ();
unset ( $_SESSION ["PEDIDO"] );
unset ( $_SESSION ["ENTREGA"] );
unset ( $_SESSION ["CLIENTE"]);
unset ( $_SESSION[$_SESSION["PEDIDO"]["USUARIO"]]);
unset ( $_SESSION ["PEDIDO"]["USUARIO"]);
unset ( $_SESSION["email"]);
header ( "location: " . UrlSite . BasePainel . "/" );
?>