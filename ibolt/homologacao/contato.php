<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title> Contato - Plander.com.br - Instrumentos Musicais </title>
<link href="css/geral.css" rel="stylesheet" type="text/css" />
</head>

<body>
<? include_once("topo.php"); ?>
	<div class="geral">
    	<img src="images/topo_21.jpg" width="982" height="6" border="0" class="esp_linha" />
    	<div class="site_map_menor float esp_menu_sitemap"><a href="index.php">HOME  /</a></div>  
        <div class="site_map_menor float"><a href="contato.php">CONTATO </a></div>
        <div class="limpa"></div>
        
        <div class="esp_contato_fon"></div>
        
        <div class="geral_quemsomos">
        	<div class="tit_quemsomos">Contato</div>
            <iframe width="916" height="338" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com.br/maps?f=q&amp;source=s_q&amp;hl=pt-BR&amp;geocode=&amp;q=R.+Alf.+Poli,+620+-+Centro&amp;aq=&amp;sll=-24.614808,-51.321488&amp;sspn=5.66149,10.821533&amp;ie=UTF8&amp;hq=&amp;hnear=R.+Alf.+Poli,+620+-+Centro,+Curitiba+-+Paran%C3%A1,+80230-090&amp;t=m&amp;ll=-25.442035,-49.271021&amp;spn=0.026197,0.078535&amp;z=14&amp;iwloc=A&amp;output=embed"></iframe>
            <div class="img_quemsomos"></div>
            
            <div class="contato_bloco1">
            	<form name="contato" id="contato" action="include/email.php?tipo=contato" method="post">
                    <div class="txt_campo_contato">Nome</div>
                    <input type="text" name="nome" class="campo_padrao campo_contato"/>
                    
                    <div class="txt_campo_contato">Email</div>
                    <input type="text" name="email" class="campo_padrao campo_contato"/>
                    
                    <div class="txt_campo_contato">Assunto</div>
                    <input type="text" name="assunto" class="campo_padrao campo_contato"/>
                    
                    <div class="txt_campo_contato">Sua Mensagem</div>
                    <textarea name="mensagem" class="campo_padrao campo_contato_grande"></textarea>
                    
                  <input type="image" src="images/enviar_03.jpg" width="73" height="25" border="0" class="contato_enviar" />
                </form>
            </div>
            
            <div class="contato_bloco2">
            	<div class="tit_contato">Endereço</div>
                <div class="txt_contato"><b>R. Alf. Poli, 620 - Centro</b></div>
                <div class="txt_contato">Centro  -  Curitiba | PR</div>
				<div class="txt_contato">CEP 80230-090</div>
                
                <div class="esp_contato"></div>
                
                <div class="tit_contato">Telefones</div>
                <div class="txt_contato"><i>Loja Virtual</i></div>
                <div class="txt_contato esp_contato_fon">41 3323.3636</div>
				<div class="txt_contato"><i>Loja Curitiba</i></div>
                <div class="txt_contato esp_contato_fon">41 3015.3525.</div>
            </div>
            
            <div class="contato_bloco3">
            	<div class="tit_contato">Horário de atendimento</div>
                <div class="txt_contato"><b>Televendas e Loja Física</b></div>
                <div class="txt_contato">Segunda a sexta das 09:00 às 18:00h.</div>
                <div class="txt_contato">Sábado das 09:00 às 13:00h.</div>
                
                <div class="esp_contato"></div>
                
               	<div class="tit_contato">Estacionamento</div>
                <div class="txt_contato"><b>R. Alf. Poli, 620 - Centro</b></div>
                <div class="txt_contato">Delta Park</div>
				<div class="txt_contato">01 hora grátis</div>
        	</div>
            
            <div class="limpa"></div>
        </div>
    </div>
    <img src="images/chat_03.png" width="43" height="105" border="0" class="chat_online" />
    <div class="limpa"></div>
<? include_once("rodape.php"); ?>
</body>
</html>
