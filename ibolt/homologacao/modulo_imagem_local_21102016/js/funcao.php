<?php
function limpa_tudo($p_paramento){
	$p_paramento = str_replace(".","",$p_paramento);
	$p_paramento = str_replace("-","",$p_paramento);
	$p_paramento = str_replace("/","",$p_paramento);
	$p_paramento = str_replace("'","",$p_paramento);
	$p_paramento = str_replace("´","",$p_paramento);
	$p_paramento = str_replace("`","",$p_paramento);
	$p_paramento = str_replace("-","",$p_paramento);
	$p_paramento = str_replace("(","",$p_paramento);
	$p_paramento = str_replace(")","",$p_paramento);
	$p_paramento = str_replace(" ","",$p_paramento);
//    $p_paramento = @ltrim($p_paramento);
 //   $p_paramento = @rtrim($p_paramento);
//	$p_paramento = @trim($p_paramento);
	return $p_paramento;
} 
?>