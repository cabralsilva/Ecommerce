<?
	@session_start();
	
	function temAcento($string) { 
		$regExp = "[áàâãäªÁÀÂÃÄéèêëÉÈÊËíìîïÍÌÎÏóòôõöºÓÒÔÕÖúùûüÚÙÛÜçÇÑñ;']";
		return ereg($regExp,$string); 
	}
		
	if($_GET["tamanho"] == "p"){
		
		$cod = "produtos/".$_GET["cod"];
		$files = glob("{$cod}/*.*");
		$linha = $files[0];
		 
		$total = count($files);
		for($i=0; $i<$total; $i++){
			if((pathinfo($files[$i], PATHINFO_EXTENSION) == "jpg") and !temAcento($files[$i])){								
				$linha = $files[$i];
				$i = $total;
			}
		}
		
		if($linha){ 
			$imagem = "../".$linha;
			?>
			<img src="includes/img.php?l=100&a=100&local=<? echo $imagem;?>" align="left" border="0"  />
		<?
		}else{?>
			<img src="includes/img.php?l=100&a=100&local=imagens/sem_imagem.jpg" align="left" border="0"  />
		<?
		}
		
	}else if($_GET["tamanho"] == "m"){
		
		$cod = "produtos/".$_GET["cod"];
		$files = glob("{$cod}/*.*");
		$linha = $files[0];
		 
		$total = count($files);
		for($i=0; $i<$total; $i++){
			if((pathinfo($files[$i], PATHINFO_EXTENSION) == "jpg") and !temAcento($files[$i])){								
				$linha = $files[$i];
				$i = $total;
			}
		}

		if($linha){ 
			$imagem = "../".$linha;
			?>
            <img src="includes/img.php?l=242&a=242&local=<? echo $imagem;?>" align="left" border="0" />
        <?
		}else{?>
			<img src="includes/img.php?l=242&a=242&local=imagens/sem_imagem.jpg" align="left" border="0"  />
        <? 
		}
		
	}else{
		
		$_SESSION["cod"] = $_GET["cod"];
		$cod = "produtos/".$_GET["cod"];
		$_files = glob("{$cod}/*.jpg");
		?>
       	 
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="X-UA-Compatible" content="IE=9" />  
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        
                <link href="modulo_imagem/css/geral.css" rel="stylesheet" type="text/css" />			
                <script type="text/javascript" src="modulo_imagem/js/jquery.jqzoom-core.js"></script>
                <link type="text/css" href="modulo_imagem/css/jquery.jqzoom.css" rel="stylesheet" />
                <link rel="stylesheet" href="modulo_imagem/css/jquery.jqzoom.css" type="text/css">
                <script type="text/javascript" src="modulo_imagem//jquery-1.4.2.min.js"></script>
                <script type="text/javascript" src="modulo_imagem//jquery.liquidcarousel.pack.js"></script>
                <script type="text/javascript" src="modulo_imagem//scripts.js"></script>
                <script language="Javascript" type="text/javascript">
                
                    function showHide(ID){
                        if(document.getElementById(ID).style.display == "none"){
                            document.getElementById(ID).style.display= "";
                            document.getElementById(ID + "span").innerHTML= "<img src='images/produto_12.jpg' width='11' height='11' border='0' class='float sinal' />";
                        }else{
                            document.getElementById(ID).style.display = "none";
                            document.getElementById(ID + "span").innerHTML= "<img src='images/produto_09.jpg' width='11' height='11' border='0' class='float sinal' />";
                        }
                    }
        
                </script> 
                <link type='text/css' rel='stylesheet' href='modulo_imagem/css/liquidcarouselproduto.css' />
                <link rel="stylesheet" href="modulo_imagem/css/style_anuncio.css" type="text/css" media="screen" />
                <script type="text/javascript" src="modulo_imagem/js/jquery-1.7.2.min.js"></script>
                <script type="text/javascript" src="modulo_imagem/js/jquery-ui-1.8.20.custom.min.js"></script>
                <script type="text/javascript" src="modulo_imagem/js/lightbox.js"></script>
                <script type="text/javascript" src="modulo_imagem/js/jquery.jqzoom-core.js"></script>
                <link type="text/css" href="modulo_imagem/css/jquery.jqzoom.css" rel="stylesheet" />
                <link type="text/css" href="modulo_imagem/css/lightbox.css" rel="stylesheet" />
                <link rel="stylesheet" href="modulo_imagem/css/jquery.jqzoom.css" type="text/css" />
                <link href="modulo_imagem/css/geral.css" rel="stylesheet" type="text/css" />			
                <link rel="stylesheet" href="modulo_imagem/css/style_anuncio.css" type="text/css" media="screen" />
    
            </head>
    
            <style>
                #sortable { padding:0px; margin-top:0; }
                .quadro { border:1px solid #CCCCCC; float:left; list-style:none; margin:8px; width:160px; height:128px; background:#FFFFFF; }
                .quadro .image { margin:5px; height:118px; float:left; }
                .quadro:hover { cursor:move; }            
                #div-input-file{ background:url(imagens/close.png) no-repeat 100% 1px; background-position: 125px 2px; height:28px; width:215px; margin:0; }
                #div-input-file .file-original{ opacity: 0.0; -moz-opacity: 0.0; filter: alpha(opacity=00); font-size:11px; width:232px; height:20px; }
                #div-input-falso{ margin-top:-18px; }
                #div-input-falso .file-falso { width:120px; height:15px; font-size:11px; font-family: Verdana; }            
                .ui-widget-overlay { position:fixed !important; }
            </style>
            
            <iframe id="iframeOP" name="iframeOP" style="border:none; width:0; height:0; display:none;"></iframe>
            <div style="width:100%; height:100%;" id="teste">
                <div id="divOP"></div>	
                <div style="margin:20px 10px 10px 10px; height:80px; padding:10px 0 0 10px; font-family:Verdana; background:#FFFFFF;" id="div_anexos">
                    <? 
                    if($_GET["permicao"] == "sim"){?>
                        <form action="includes/operador.php?tabela=<?php echo "produto"; ?>&acao=anexar&codigo=<?php echo base64_encode($_codigo); ?>& desc= <? echo base64_encode($_descri); ?>" target="iframeOP" method="post" enctype="multipart/form-data">
                            <div style="height:60px; float:left; width:300px;">
                                <label style="display:block; font-size:9px; font-weight:bold; color:#666666; margin:0 0 5px 5px;">ANEXAR ARQUIVOS <span style="font-weight:normal; margin-left:10px;">(MULTI SELEÇÃO)</span></label>
                                <input id="arquivo" name="arquivo[]" type="file" multiple="multiple" accept="image/*" size="30" onchange="listaFiles(this, 'div_lista', 'div_anexos', 'div_botoes')"/>
                            </div>
                            <div style="height:60px; overflow-y:auto; float:left; width:220px;" id="div_lista"></div>
                            <div style="height:60px; float:left; width:220px;" id="div_botoes"></div>
                            <div style="clear:both;"></div>
                        </form>
                    <? 
                    }?>
                </div>
                <div style="margin:0 10px 0 10px; padding:10px 10px; font-family:Verdana;">  
                    <span style="font-size:13px; color:#666666;">Quantidade de fotos: <strong><?php echo count($_files); ?></strong></span>      
                </div>
                <div style="font-family:Verdana; border-top:2px solid #CCCCCC;">
                    <?
                    if($_files[0]){
						?>
                        <a href="javascript:void(0);" id='btn_img' onClick="$('#btn_img').attr('onclick', '$(\'#<?php echo "img_" ."0"; ?>\').click();'); $(this).click();">
                            <img src="includes/img.php?l=398&a=298&local=../<? echo $_files[0]; ?> " border="0" class="borda_img_prod" align="top"/>
                        </a>	 	           				
                    <?	
                    }else{
                        echo "<a>";
                        echo "<div id=\"change_imagem_pequena\"><img src=\"includes/img.php?l=398&a=298&local=../imagens/sem_imagem.jpg\" border=\"0\" class=\"borda_img_prod\"> </div>";
                        echo "</a>";
                    }
                    if($_files[0]){?>      			
                        <a href="javascript:void(0);" id='btn_img' onClick="$('#btn_img').attr('onclick', '$(\'#<?php echo "img_" ."0"; ?>\').click();'); $(this).click();">				
                        </a>
                    <?
                    }
                    for($_i=0; $_i<count($_files); $_i++){
                        if($_i<=3){
                            ?>											
                            <a href="javascript:void(0);" <? if(count($_files)!= 1){ ?>rel="{gallery: 'gal1', smallimage: 'includes/img.php?l=398&a=298&local=../<?php echo $_files[$_i]; ?>',largeimage: '<?php echo $_files[$_i]; ?>'}" onMouseOver="$('#btn_img').attr('onclick', '$(\'#<?php echo "img_" . $_i; ?>\').click();'); $(this).click();"<? }?>>
                            </a>	
                        <? 
                        }?>
                        <a id="<? echo "img_".$_i; ?>" href="<?php echo $_files[$_i]; ?>" style="display:none;" rel="lightbox[]"></a>
                    <? 
                    }?> 			   
                </div>
            </div>
		</html>
	<? 
	}?>