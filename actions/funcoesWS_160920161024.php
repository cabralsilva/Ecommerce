<?php
  	include __DIR__ . "/..\class\constantes.php";
	function inserirItemsNoERP($pedido, $items, $resposta){
    $return = sendWsJson($pedido, UrlWs . "limparItensPedido");

    if ($return->codStatus != 1) {
      $_SESSION["PEDIDO"]["USUARIO"] = "";
      echo "<script> alert('Falha no Login: $return->msg. Houve um erro ao limpar os items do pedido na table PEDIDOPRODUTOGRADE<br/>'); </script>";
      echo "<script> parent.window.location.href='../carrinhoLogin'; </script>";
      die();
    }else{
      $_chaves = array_keys($items);
      for ($_i=0; $_i<count($_chaves); $_i++){
        $item = array(
          'codigo_pedido' => $resposta->model->codigoPedido,
          'codigo_produto_grade' => $items[$_chaves[$_i]]["codigo_produto_grade"],
          'quantidade' => $items[$_chaves[$_i]]["quantidade"],
          'valor' => $items[$_chaves[$_i]]["valor"],
          'descricao' => $items[$_chaves[$_i]]["descricao"]
        );
        $json_object = json_encode($item);
        $retornoItemPedido = sendWsJson($json_object, UrlWs . "itempedido");
        if ($retornoItemPedido->codStatus != 1) {
          echo "<br />Houve um erro na execução do sql de inserção de item do pedido (Item -> $_i)<br/>" . $retornoItemPedido->msg;
          echo "<script> alert('Houve um erro nos items do pedido<br/>'); </script>";
          inserirItemsNoERP($pedido, $items, $resposta);
        }
      }
    }
    
    
  }

  function inserirItemsNoERPFinalizacao($pedido, $items){
    $return = sendWsJson($pedido, UrlWs . "limparItensPedido");
    if ($return->codStatus == 1){
      $_chaves = array_keys($items);
      for ($_i=0; $_i<count($_chaves); $_i++){
        $item = array(
          'codigo_pedido' => $return->model->codigoPedido,
          'codigo_produto_grade' => $items[$_chaves[$_i]]["codigo_produto_grade"],
          'quantidade' => $items[$_chaves[$_i]]["quantidade"],
          'valor' => $items[$_chaves[$_i]]["valor"],
          'descricao' => $items[$_chaves[$_i]]["descricao"]
        );
        $json_object = json_encode($item);
        $retornoItemPedido = sendWsJson($json_object, UrlWs . "itempedido");
        if ($retornoItemPedido->codStatus != 1) {
          echo "<br />Houve um erro nos item do pedido<br/>" . $retornoItemPedido->msg;
          echo "<script> alert('Houve um erro nos items do pedido<br/>'); </script>";
          inserirItemsNoERP($pedido, $items, $resposta);
        }
      }
    }else{
      echo "<br/>Houve um erro nos items do pedido<br/>";
      $_SESSION["PEDIDO"]["USUARIO"] = "";
      echo "<script> alert('Houve um erro nos items do pedido<br/>'); </script>";
      inserirItemsNoERP($pedido, $items);
    }
  }


  function sendWsJson($json_object, $ws){
    $http = stream_context_create(array(
      'http' => array(
          'method' => 'POST',                    
          'header' => "Content-type: application/json\r\n".
                      "Connection: close\r\n".
                      "Content-Length: ".strlen($json_object)."\r\n",
          'content' => $json_object                             
      )
    ));
    // Realize comunicação com o servidor
    $envelope = file_get_contents($ws, null, $http);            
    $resposta = json_decode($envelope);  //Parser da resposta Json
    
    if ($envelope === FALSE){
      echo "<script> alert('Servidor temporariamente fora do ar. Por favor tente acessar mais tarde! Caso o problema persista entre em contato com nosso suporte.'); </script>";
    } else return $resposta;
      
  }

  function sendWsLogin($array_object, $ws){
    $variaveis = http_build_query($array_object);
    $http = stream_context_create(array(
      'http' => array(
          'method' => 'POST',                    
          'header' => "Connection: close\r\n".
                      "Content-type: application/x-www-form-urlencoded\r\n".
                      "Content-Length: ".strlen($variaveis)."\r\n",
          'content' => $variaveis                             
      )
    ));
    // Realize comunicação com o servidor
    $envelope = file_get_contents($ws, null, $http);            
    $resposta = json_decode($envelope);  //Parser da resposta Json
    
    if ($envelope === FALSE){
      echo "<script> alert('Servidor temporariamente fora do ar. Por favor tente acessar mais tarde! Caso o problema persista entre em contato com nosso suporte.'); </script>";
    } else return $resposta;
    
    
  }
?>