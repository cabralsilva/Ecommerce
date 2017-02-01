<?php
//if(basename(getcwd()) == "public_html"){
	?>
	<!-- no final do arquivo, antes de limpar as sessões -->
	<!-- carrinhoConfirmacao.php -->
	<!-- Google Code for Convers&atilde;o Conversion Page -->
	<script type="text/javascript">
		/* <![CDATA[ */
		var google_conversion_id = <?= $_SESSION["PEDIDO"]["codigo"] ?>;
		var google_conversion_language = "pt";
		var google_conversion_format = "";
		var google_conversion_color = "";
		var google_conversion_label = "";
		var google_conversion_value = <?= $_SESSION["PEDIDO"]["subtotal"] + $_SESSION["PEDIDO"]["valor_frete"] ?>;
		var google_conversion_currency = "BRL";
		var google_remarketing_only = false;
		/* ]]> */
	</script>
	<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
	</script>
	<noscript>
		<div style="display:inline;">
			<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/956719473/?value=1.00&amp;currency_code=BRL&amp;label=1r9eCPXF2mYQ8cKZyAM&amp;guid=ON&amp;script=0"/>
		</div>
	</noscript>
<?php
//}
?>