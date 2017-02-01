<?php
	session_start(); 
	$pasta        = $_SESSION["s_pasta"]; 
	$sub_pasta    = $_SESSION["s_sub_pasta"]; 
	$nome_inicial = $_SESSION["s_nome_inicial"];

	$diretorio = "../".$pasta."/".$sub_pasta;	
	$contents = scandir($diretorio);
	$total_arquivos_pasta = count($contents);

	$remove  = $_REQUEST['remove'];

	//print_r($remove);
	//die();
	$file = "../$pasta/$sub_pasta/$remove";
	if ($pasta == "produtos"){
		echo "File: $file";
		//die();
		if (unlink($file)) {   
			echo "O arquivo $file foi excluído\n";
	   	}else {
	   		echo "não foi possível excluir $file\n";
		}


		//ajusta a ordem (renomeia) dos arquivos restantes no diretório
		$pos = (strripos($file, "_")) +1;
		$ordem = substr($file, $pos, -4);
		$contents = array();
		$files = scandir($diretorio); 
		foreach($files as $file)
		{
		    if(is_file($diretorio."/".$file)){
		        array_push($contents, $file);
		    }
		}
		sort($contents);
		for ($i=0; $i < count($contents) ; $i++) {
			$pos2 = (strripos($contents[$i], "_")) +1;
			$nome = substr($contents[$i], 0, ($pos2-1));
			$ordem2 = substr($contents[$i], $pos2, -4);
			$extensao_arquivo = strrchr( $contents[$i], '.' );
			if ($ordem2 > $ordem) {
				$old_name = $diretorio."/".$contents[$i];
				$new_name = $diretorio."/".$nome."_".($i+1).$extensao_arquivo;
				rename($old_name, $new_name);
			}
		}
		//FIM AJUSTES DE ORDEM







		/*die();/*
		$tmp_w_ = date("YmdHi");
		for ($_i=1; $_i<=$total_arquivos_pasta; $_i++){
			$old_file = "../$pasta/$sub_pasta/$nome_inicial".$_i.".jpg";  
			//$j = $_i+1;
			$new_file = "../$pasta/$sub_pasta/$tmp_w_".$_i.".jpg";
			@rename($old_file, $new_file);
		}
		
		for ($_i=1; $_i<=$total_arquivos_pasta; $_i++){
			$old_file = "../$pasta/$sub_pasta/$nome_inicial".$_i.".jpg";  
			//$j = $_i+1;
			$new_file = "../$pasta/$sub_pasta/$tmp_w_".$_i.".jpg";
			@rename($old_file, $new_file);
		}
			
		$contents = scandir($diretorio);
		$totala = count($contents);
		for($x=0; $x<$totala; $x++){
			$nome_tmp = $contents[$x];
			$_i = $x + 1;
			$old_file = $nome_tmp;  
			//$j = $_i+1;
			$new_file = "../$pasta/$sub_pasta/$nome_inicial".$_i.".jpg";
			@rename($old_file, $new_file);
		}*/
	}  else{
		//tenta excluir $file
		if (unlink($file)) {
		   //echo "O arquivo '".$_REQUEST["remove"]."' foi excluído\n";
		} 
		   //echo "não foi possível excluir '".$_REQUEST["remove"]."'\n";

		//ajusta a ordem (renomeia) dos arquivos restantes no diretório
		$ordem = substr($remove, 0, 1);
		$contents = array();
		$files = scandir($diretorio); 
		foreach($files as $file)
		{
		    if(is_file($diretorio."/".$file)){
		        array_push($contents, $file);
		    }
		}
		sort($contents);
		for ($i=0; $i < count($contents) ; $i++) {
			if (substr($contents[$i], 0, 1) > $ordem) {
				$old_name = $diretorio."/".$contents[$i];
				$new_name = $diretorio."/".($i+1).substr($contents[$i], 1);
				rename($old_name, $new_name);
			}
		}
		//FIM AJUSTES DE ORDEM
	}
	//die();
	//die("<script>window.location.href='envia_arquivo.php';</script>");
	header("Location: envia_arquivo.php");
	//header("refresh: 1; url=envia_arquivo.php"); 
	die();
?>