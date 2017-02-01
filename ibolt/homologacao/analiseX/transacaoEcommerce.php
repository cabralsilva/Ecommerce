<?php
//if(basename(getcwd()) == "public_html"){
	?>
    <!-- no final do arquivo, antes de limpar as sessões -->
    <!-- carrinhoConfirmacao.php -->
    <script type="text/javascript">
        ga('require', 'ecommerce');
        
        ga('ecommerce:addTransaction', {
            'id': '<?= $_SESSION["PEDIDO"]["codigo"] ?>',
            'affiliation': '',
            'revenue': '<?= $_SESSION["PEDIDO"]["subtotal"] + $_SESSION["PEDIDO"]["valor_frete"] ?>',
            'shipping': '<?= $_SESSION["PEDIDO"]["valor_frete"] ?>',
            'tax': '',
            'currency': ''  // local currency code.
        });
    </script>
    <?php
    $_chaves = array_keys($_SESSION["CART"]);
    for ($_i=0; $_i<count($_chaves); $_i++){
    ?>
        <script type="text/javascript">
            
            ga('ecommerce:addItem', {  
                'id': '<?= $_SESSION["PEDIDO"]["codigo"] ?>',
                'name': '<?= $_SESSION["CART"][$_chaves[$_i]]["descricao"] ?>',
                'sku': '<?= $_SESSION["CART"][$_chaves[$_i]]["codigo_produto_grade"] ?>',
                'category': '',
                'price': '<?= $_SESSION["CART"][$_chaves[$_i]]["valor"] ?>',
                'quantity': '<?= $_SESSION["CART"][$_chaves[$_i]]["quantidade"] ?>'
            });
            ga('ecommerce:send');
        
        </script>
    <?php		
    }
//}
?>