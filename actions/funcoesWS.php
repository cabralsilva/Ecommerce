<?php
//   include __DIR__ . "\../class/constantes.php";
//   include __DIR__ . "\../actions/funcoes.php";
	
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
    $envelope = file_get_contents($ws, false, $http);  
    $resposta = json_decode($envelope);  //Parser da resposta Json
//     print_r($ws);
    if ($envelope === FALSE){
      $_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
      $_conteudo .= "<strong>Descrição: </strong>Não foi possível localizar o WS ou o serviço solicitado na url <u>" . $ws . "</u><br><br>";
      $_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
      $_conteudo .= "<strong>Página Anterior: </strong>" . (isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:"Não identificada") . "<br><br>";
      $_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
      $_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
      $_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
      $_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
      $_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
      sendEmailLog($_conteudo);
      if (isset($_GET["andamento"]) == null){
        echo "<script> alert('Ops, servidor temporariamente fora do ar!'); </script>";
      }
      
      return null;
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
    $envelope = @file_get_contents($ws, null, $http);
    $resposta = json_decode($envelope);  //Parser da resposta Json
    
    if ($envelope === FALSE){
      $_conteudo = "<strong><u>Mensagem de Log Erro do site www.plander.com.br</u></strong><br><br><br>";
      $_conteudo .= "<strong>Descrição: </strong>Não foi possível localizar o WS ou o serviço solicitado na url <u>" . $ws . "</u><br><br>";
      $_conteudo .= "<strong>Data: </strong>" . date('d/M/y G:i:s') . "<br><br>";
      $_conteudo .= "<strong>Página Anterior: </strong>" . $_SERVER['HTTP_REFERER'] . "<br><br>";
      $_conteudo .= "<strong>Página Atual: </strong>" . $_SERVER['PHP_SELF'] . "<br><br>";
      $_conteudo .= "<strong>URL: </strong>" . $_SERVER['SERVER_NAME'] . $_SERVER ['REQUEST_URI'] . "<br><br>";
      $_conteudo .= "<strong>IP Cliente: </strong>" . $_SERVER["REMOTE_ADDR"] . "<br><br>";
      $_conteudo .= "<strong>Browser: </strong>" . getBrowser() . "<br><br>";
      $_conteudo .= "<strong>Sistema Operacional: </strong>" . php_uname() . "<br><br>";
      sendEmailLog($_conteudo);
      echo "<script> alert('Ops, servidor temporariamente fora do ar!'); </script>";
      return null;
    } else return $resposta;
    
    
  }
?>