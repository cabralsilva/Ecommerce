<?php

@session_start();

//função que manda informações da conversão (passo3)
function comercioEletronico($codigoPedido, $valorTotalPedido) {
?>
	<script type="text/javascript">
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-56750274-1']);
		_gaq.push(['_trackPageview']);
		_gaq.push(['_addTrans',
		  '<?= $codigoPedido ?>', // transaction ID - required
		  '<?= "" ?>',         // affiliation or store name
		  '<?= $valorTotalPedido ?>',      // total - required ex: 50.20
	
		]);
	
		_gaq.push(['_trackTrans']); //submits transaction to the Analytics servers
	
		(function() {
		  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	</script>
<?	  	
}

//função de acompanhamento de todas as páginas (rodapé e rodapé_ssl) 
function acompanhamentoAnalytics() {
?>
	<script type="text/javascript">
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		  ga('create', 'UA-56750274-1', 'auto');
		  ga('send', 'pageview');
	</script>
<?	  	
}

//função de conversão do google adwords (passo3)
function adwords() {
?>
	<script type="text/javascript">
		var google_conversion_id = 956719473;
		var google_conversion_language = "en";
		var google_conversion_format = "2";
		var google_conversion_color = "ffffff";
		var google_conversion_label = "U2M0CIO7qFgQ8cKZyAM";
		var google_conversion_currency = "BRL";
		var google_remarketing_only = false;
	</script>
	<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
	</script>
	<noscript>
		<div style="display:inline;">
			<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/956719473/?value=500.00&amp;currency_code=BRL&amp;label=U2M0CIO7qFgQ8cKZyAM&amp;guid=ON&amp;script=0"/>
		</div>
	</noscript>
<?
}


//função de acompanhamento da página inicial (index)
//não funcionou por função, está direto na index
function webmasterTools() {
?>
	<meta name="google-site-verification" content="XYHVoD6vlr9uYGRVSY99olgB5ziH2F-c9E6CxBgTtZ0" />
<?
}
?>