<?php	
	/************************/
	session_start();
	$link_ftp         = $_SESSION["s_link_ftp"]; 
	$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
	$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
	$senha_ftp        = $_SESSION["s_senha_ftp"]; 
	$projeto_ftp      = $_SESSION["s_projeto_ftp"]; 
	$pasta_ftp        = $_SESSION["s_pasta_ftp"];
	
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

	//quando banner limpa essa variavel
	//if($_SESSION["s_sub_pasta_ftp"] == "banners"){
	//	unset($_SESSION["s_sub_pasta_ftp"]);
	//}else{
		$sub_pasta_ftp = $_SESSION["s_sub_pasta_ftp"]; 
	//} 
	$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";
	
	//Realiza a coneao
	$conexao_ftp = ftp_connect( $servidor_ftp );

	//Tenta fazer login
	$login_ftp = @ftp_login( $conexao_ftp, $usuario_ftp, $senha_ftp );

	//mostra o array de altea‡?o
	//echo "<pre>";
	//print_r($_SESSION);
	
	//Caminho da pasta FTP
	if($pasta_ftp == "public_html/produtos"){
		$caminho = $pasta_ftp."/".$sub_pasta_ftp;
		$_SESSION['s_caminho'] = $caminho;
	}elseif($pasta_ftp == "public_html/banners"){
		$caminho = $pasta_ftp."/".$sub_pasta_ftp;
		$_SESSION['s_caminho'] = $caminho;
	}
	
	if($pasta_ftp == "public_html/produtos"){
		$caminho = $pasta_ftp."/".$sub_pasta_ftp;
	}elseif($pasta_ftp == "public_html/banners"){
		$caminho = $pasta_ftp."/".$sub_pasta_ftp."/";
	}	
	
	//Muda o diretorio atual para o especificado. 
	//if(ftp_chdir($conexao_ftp, $caminho)){
	//$_ponteiro = ftp_cdup($conexao_ftp);	
	
	//Retorna a lista dos arquivos em um dado diretorio
	//$caminho = "produtos/walter/";
	$_arquivo = ftp_nlist($conexao_ftp, $caminho);
	//Ordena um array
	@sort($_arquivo);
	
	//$_arquivo = array_slice($_arquivo, 2);

	//conta o total de arquivo no diretorio	
	echo $total = count($_arquivo);
	
	//exit;
	//quando for produto entra nessas condicoes
	//$link = "http://www.plander.com.br";
	if($pasta_ftp == "public_html/produtos"){
		for($_i=0; $_i<$total; $_i++){
			$cont_img = $_i;
			
			//POST que recebe pra ordenar as imagens
			//$ordem = array_search("img_" . ($_i), $_REQUEST["ordem"]);
	
			//nome inicial que foi definido + o contador que com isso vai ser o nome da nova imagem
			$_images2[$cont_img] = "$nome_inicial_ftp" . $_i . ".jpg";
			
			//lista o arquivo antigo para ser alterado
			$contents = ftp_nlist($conexao_ftp, "$caminho") or die("Erro conexao");	
		
			$old_file = $caminho."/".$_REQUEST['ordem'][$_i];
			
			$new_file = $caminho."/temp_".$_i.".jpg";
			
			//echo "<p>".$old_file;
			//echo "<br>".$new_file;
			//echo  $caminho;
			///produtos/1000190000193/temp_3.jpg
			ftp_rename($conexao_ftp, $old_file, $new_file)or die("Erro conexao");		
			//echo $conexao_ftp;
		    //echo "<br>".$total;
		}
		
	// echo "<hr>";
		//renomeia os temporarios
		for ($_iii=0; $_iii<$total; $_iii++){
			$old_files = $caminho."/temp_".$_iii.".jpg";  
			
			$jjj = $_iii;//+1;
			$new_files = $caminho."/{$nome_inicial_ftp}".$jjj.".jpg";  
			
			$new_files = tirarAcentosER($new_files);
			
			//echo "<p>".$old_file;
			//echo "<br>".$new_file;
				
			@ftp_rename($conexao_ftp, $old_files, $new_files);				
		}
	}  
	
	//quando for banner entra nessa condicao	
	if($pasta_ftp == "public_html/banners"){
		//echo "<pre>";
		//print_r($_REQUEST);
		//ftp_chdir($conexao_ftp, $caminho);
		$contents = ftp_nlist($conexao_ftp, $caminho);
		//$contents = array_slice($contents, 2);
		$total = count($contents);
		for ($_i=0; $_i<$total; $_i++){			
			
			$old_files = $_REQUEST['ordem'][$_i];	

			$old_files = str_replace($caminho, '', $old_files); 			
			
			//echo "<p>underline: ".$under = substr($contents[$_i], 1, 1);
			$under = substr($old_files, 1, 1);
			
			if($under == "_"){
				$new_files = $caminho.$_i."_".substr($old_files, 2);
				//echo "under";
			}else{
				//echo "sem under";
				$new_files = $caminho.$_i."_".$old_files;  
			}
			
			$old_files = $caminho.$old_files;
			
			$new_files = tirarAcentosER($new_files);
            
			echo "<p>".$old_files;
			echo "<br>".$new_files;
            
			ftp_rename($conexao_ftp, $old_files, $new_files);		
		}
	}
//}

?>  
<script>
	window.location.reload(true);
</script>