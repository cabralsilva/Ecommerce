<?php
	@session_start();
	
	require_once("../class/constantes.php");
	require_once("funcoes.php");
	
	if (is_array(@$_SESSION["CART"])==false)
		$_SESSION["CART"] = array();
	
	//if(@$_GET["acao"]=="frete") 
	
	//CÁLCULO DO FRETE	
	if(@$_GET["tipo"]!="")
		$_SESSION["PEDIDO"]["valor_frete"] = $_SESSION["PEDIDO"]["fretes_disponiveis"][@$_GET["tipo"]];
	
	$_juros[true] = "sem juros";
    $_juros[false] = "com juros";
	
	$_SESSION["PEDIDO"]["valor_total"] = $_SESSION["PEDIDO"]["subtotal"]+$_SESSION["PEDIDO"]["valor_frete"];
	
	$_selectParcelas = "<select name=\"parcelamento\" id=\"parcelamento\">";
	
   	for($_i=0; $_i<$_SESSION["PEDIDO"]["quantidade_parcelas_com_juros"]; $_i++) {
    	$_selectParcelas .= "<option value=\"" . ($_i+1) . "\">";
    	$_selectParcelas .= ($_i+1) . "x " . $_juros[$_i<$_SESSION["PEDIDO"]["quantidade_parcelas_sem_juros"]] . " de";
		$_selectParcelas .= " <span>";
		
		if($_i<$_SESSION["PEDIDO"]["quantidade_parcelas_sem_juros"])
    		$_selectParcelas .= "R$ " . number_format($_SESSION["PEDIDO"]["valor_total"] / ($_i+1), 2, ",", ".");
		else
			$_selectParcelas .= "R$ " . number_format(pmt(JUROS,($_i+1),$_SESSION["PEDIDO"]["valor_total"]), 2, ",", ".");
		
		$_selectParcelas .= "</span>";
		$_selectParcelas .= "</option>";
	}
	
	$_selectParcelas .= "</select>";
	
	$_myArray = array(
					"R$ " . number_format($_SESSION["PEDIDO"]["valor_frete"],2,",","."),
					"R$ " . number_format($_SESSION["PEDIDO"]["valor_total"],2,",","."),
					$_selectParcelas);
	echo json_encode($_myArray);
?>