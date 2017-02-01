<?php
	
	define("EMAIL_PLANDER_SMTP", "smtp.plander.com.br");
	define("PORTA_PLANDER_SMTP", 587);
	define("USUARIO_PLANDER_EMAIL", "plander@plander.com.br");
	define("SENHA_PLANDER_EMAIL", "pLand&er@20!6");
	define("NOME_PLANDER_EMAIL", "PLANDER.COM");

	
	define("EMAIL_IBOLT_SMTP", "smtp.ibolt.com.br");
	define("PORTA_IBOLT_SMTP", 587);
	define("USUARIO_IBOLT_EMAIL", "daniel.cabral@ibolt.com.br");
	define("SENHA_IBOLT_EMAIL", "ib@017*");
	
	define("UrlWs", "http://177.185.11.244:8080/wshomo/");
	define("JUROS", 0.029);
	//define("URL", "http://localhost/www/plander_novo_2016/plander/");
	define("URL", "http://localhost:8080/plander/");
	
	define("SSL", 1); //DEIXAR COMO 1 CASO FOR UM AMBIENTE QUE TENHA CRIPTOGRAFIA, NAO SEJA TESTE
	
	if (SSL==1)
		define("URL_SSL", "http://localhost:8080/plander/");
		//DEFINE("URL_SSL", "https://plander2.websiteseguro.com/");
		//DEFINE("URL_SSL", "http://localhost/www/plander_novo_2016/planderSSL/");
	else
		define("URL_SSL", "");
	
	//meta tags
	define("DESCRIPTION", "Plander.");
	define("AUTHOR", "iBoltSys desenvolvimento de sistemas");
	define("TITLE", "Plander.com.br - Instrumentos musicais");
	define("CNPJ", "02.600.446/0001-82");
	
	define("TELEFONE", "(41) 3323-3636");
	define("CELULAR", "(41) 99896-1818");
	define("CELULAR_2", "(41) 99932-0452");
	
	//tabelas
	define("TB_PRODUTO", "ProdutoWeb");
	define("TB_PRODUTOS", "ProdutoGradeWeb");
	define("TB_GRUPO", "GrupoWeb");
	define("TB_CATEGORIA", "CategoriaWeb");
	define("TB_PRODCAT", "ProdutoCategoriaWeb");
	define("TB_SESSAO", "SessaoWeb");
	define("TB_Pedido", "PedidoWeb");
	define("TB_New", "NewsletterWeb");
	define("TB_CLIENTE", "ClienteWeb");
	define("TB_FABRICANTE", "FabricanteWeb");
	//define("EMAIL", "uriel.fourth.angel@gmail.com");
	//define("EMAIL", "gerencia@plander.com.br");
	define("EMAIL", "plander@plander.com.br");
	define("LIMITE", 10);
	define("LIBERADO", "Liberado");
	
	define("SUBSTR_PRODUTO", 98); //para UPPER
	//define("SUBSTR_PRODUTO", 108); //para não UPPER
	
	define("SUBSTR_PRODUTO_INICIO", 75); //para UPPER
	//define("SUBSTR_PRODUTO_INICIO", 95); //para não UPPER
	
	define("DEVELOP", true);
	define("ECOMMERCE", TRUE); // desativa toda a área de compra do site, vira catálogo
	
	define("CEP_ORIGEM", 80240031);
	define("TAXA_FRETE", 20);
	
	$_limite = array(10, 20, 30, 40, 50);
	
	$_ordenacao["visualizacao_c"] = array("visualizacoes"=>"ASC");
	$_ordenacao["visualizacao_d"] = array("visualizacoes"=>"DESC");
	$_ordenacao["visualizacao_d"] = array("visualizacoes"=>"ORDER BY");
	
	$_arrayUf = array(
						"AC",
	                  	"AL",
	                  	"AP",
	                  	"AM",
	                  	"BA",
	                  	"CE",
	                  	"DF",
	                  	"ES",
	                  	"GO",
	                  	"MA",
	                  	"MS",
	                  	"MT",
	                  	"MG",
	                  	"PA",
	                  	"PB",
	                  	"PR",
	                  	"PE",
	                  	"PI",
	                  	"RJ",
	                  	"RN",
	                  	"RS",
	                  	"RO",
	                  	"RR",
	                  	"SC",
	                  	"SP",
	                  	"SE",
	                  	"TO");
?>
