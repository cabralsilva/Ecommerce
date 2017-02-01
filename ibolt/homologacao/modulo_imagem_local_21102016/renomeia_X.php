<?php
	@session_start();
	
	function tirarAcentosER($p_paramento){
		$p_paramento = str_replace("á","a",$p_paramento);
		$p_paramento = str_replace("à","a",$p_paramento);
		$p_paramento = str_replace("ã","a",$p_paramento);
		$p_paramento = str_replace("é","e",$p_paramento);
		$p_paramento = str_replace("ê","e",$p_paramento);
		$p_paramento = str_replace("í","i",$p_paramento);
		$p_paramento = str_replace("ó","o",$p_paramento);
		$p_paramento = str_replace("ô","o",$p_paramento);
		$p_paramento = str_replace("õ","o",$p_paramento);
		$p_paramento = str_replace("ú","u",$p_paramento);
		$p_paramento = str_replace("ç","c",$p_paramento);
		$p_paramento = str_replace("Á","A",$p_paramento);
		$p_paramento = str_replace("À","A",$p_paramento);
		$p_paramento = str_replace("Ã","A",$p_paramento);
		$p_paramento = str_replace("É","E",$p_paramento);
		$p_paramento = str_replace("Ê","E",$p_paramento);
		$p_paramento = str_replace("Í","I",$p_paramento);
		$p_paramento = str_replace("Ó","O",$p_paramento);
		$p_paramento = str_replace("Ô","O",$p_paramento);
		$p_paramento = str_replace("Õ","O",$p_paramento);
		$p_paramento = str_replace("Ú","U",$p_paramento);
		$p_paramento = str_replace("Ç","C",$p_paramento);
		return $p_paramento;
	} 


	function tirarAcentosER2($p_paramento){
		$p_paramento = str_replace("-","",$p_paramento);
		$p_paramento = str_replace(" _ ","",$p_paramento);
		$p_paramento = str_replace("/","",$p_paramento);
		$p_paramento = str_replace("'","",$p_paramento);
		$p_paramento = str_replace("´","",$p_paramento);
		$p_paramento = str_replace("`","",$p_paramento);
		$p_paramento = str_replace("^","",$p_paramento);
		$p_paramento = str_replace("~","",$p_paramento);
		$p_paramento = str_replace(" ","_",$p_paramento);
		$p_paramento = str_replace(" - ","",$p_paramento);
		$p_paramento = str_replace(" / ","",$p_paramento);
		$p_paramento = str_replace(" ' ","",$p_paramento);
		$p_paramento = str_replace(" ´ ","",$p_paramento);
		$p_paramento = str_replace(" ` ","",$p_paramento);
		$p_paramento = str_replace(" ^ ","",$p_paramento);
		$p_paramento = str_replace(" ~ ","",$p_paramento);
		return $p_paramento;
	}

 	if(isset($_REQUEST["usr"]) && isset($_REQUEST["pwd"])){
 		if(($_REQUEST["usr"] == "ibtpdr") && ($_REQUEST["pwd"] == "ibt3022")){
 			$_SESSION["s_pasta"]        = $_REQUEST['pasta']; 
			$_SESSION["s_sub_pasta"]    = $_REQUEST['sub_pasta']; 

			if ($_SESSION["s_pasta"] == "produtos"){
				$xx = tirarAcentosER($_REQUEST['nome_inicial']); 
		    	$_SESSION["s_nome_inicial"] = tirarAcentosER2($xx) . "_"; 
			}
		    
			$_SESSION['s_caminho'] = "../".$_SESSION["s_pasta"]."/".$_SESSION["s_sub_pasta"];

			if (!file_exists($_SESSION['s_caminho'])) {
				if (!@mkdir($_SESSION['s_caminho'])) {	
				 	echo "Falha ao criar diretório: " .$_SESSION["s_sub_pasta"];
				 	die();
				}
			}
			header("Location: envia_arquivo.php");	
 		}else{
 			echo "Not Authentication";
 		}
 	}else{
 		echo "Fail Requisition";
 	}
	
?>