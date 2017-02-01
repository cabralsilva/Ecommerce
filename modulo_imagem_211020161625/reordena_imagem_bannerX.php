<?php	
	/************************/
	session_start();
	$servidor_ftp     = $_SESSION["s_servidor_ftp"]; 
	$usuario_ftp      = $_SESSION["s_usuario_ftp"]; 
	$senha_ftp        = $_SESSION["s_senha_ftp"]; 
	$projeto_ftp      = $_SESSION["s_projeto_ftp"]; 
	$pasta_ftp        = $_SESSION["s_pasta_ftp"]; 
	$sub_pasta_ftp    = $_SESSION["s_sub_pasta_ftp"]; 
	$nome_inicial_ftp = $_SESSION["s_nome_inicial_ftp"]."_";	
	
	//Realiza a conexão
	$conexao_ftp = ftp_connect( $servidor_ftp );
	
	//Tenta fazer login
	$login_ftp = @ftp_login( $conexao_ftp, $usuario_ftp, $senha_ftp );

	//Caminho da pasta FTP
	$caminho = "/".$projeto_ftp."/".$pasta_ftp;

	//if(ftp_chdir($conexao_ftp, $caminho)){
	//$_ponteiro  = ftp_cdup($conexao_ftp);	
	
	//$_arquivo = ftp_nlist($conexao_ftp, $caminho);
		
	/*****************/
	//$contents = ftp_nlist($conexao_ftp, $caminho);
	
	//$xxx = "http://www.ibolt.com.br:7080/projetos/walter";	
	$link = "/projeto_recebe_ordenacao_imagem/banner";
	
	$c = ftp_rename($conexao_ftp,$link."/a.jpg", "$link/aa.jpg");	
	if($c){
		echo "certo";
	}else{
		echo "errado";
	}
	
	
	//unset($contents[@$x]);
	/*$total = count($contents);
	for($x=1; $x<=$total; $x++){ 
		$new_file = $contents[$x];//. ".jpg";
		$old_file = $link."/teste.jpg";
/*		$_images[$_i] = "$nome_inicial_ftp" . $_i . ".jpg";
		$ordem = array_search("img_" . ($_i+1), $_REQUEST["ordem"]);
		$_images2[$_i] = "$nome_inicial_ftp" . $ordem . ".jpg";
*/	
		//echo "<p>old: ".$old_file = $_files[$x];  
		//echo "<br>new:".$new_file = "_XX_".$_files[$x];
		/*echo "<hr>";
*/
		echo "nome: ".$xx.$new_file;
		echo "<br>old: ".$xx.$old_file;
		echo "<hr>";
		
		?>
       
		<?
		//$xx = "http://www.ibolt.com.br:7080/projetos/walter";
		
		/*if (ftp_rename($conexao_ftp,$old_file, $new_file)) {
			echo " certo";
		}else{
			echo " errado";
		}*/
		
	//}			

		/*****************/
			

	/*$total = count($_arquivo);
	for ($_i=1; $_i<=$total; $_i++){
		
		$_images[$_i] = "$nome_inicial_ftp" . $_i . ".jpg";
		$ordem = array_search("img_" . ($_i+1), $_REQUEST["ordem"]);
		$_images2[$_i] = "$nome_inicial_ftp" . $ordem . ".jpg";
		
		echo "<p>old: ".$old_file = $caminho."/".$_images[$_i];  
		echo "new:".$new_file = $caminho."/tmp_".$_images2[$_i];
		echo "";
		
		
		if (ftp_rename($conexao_ftp, $old_file, $new_file)) {
			echo " certo";
		}else{
			echo " errado";
		}
	}*/

	/*for ($_i=0; $_i<$total; $_i++){
		$old_file = "$caminho/tmp_w_".$_i.".jpg";  
		$j = $_i+1;
		$new_file = "$caminho/{$nome_inicial_ftp}".$j.".jpg";  
		@ftp_rename($conexao_ftp, $old_file, $new_file);		
	}*/
//}
?>