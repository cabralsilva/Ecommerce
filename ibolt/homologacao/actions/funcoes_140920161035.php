<?php

	/**
	* Função para gerar senhas aleatórias
	*
	* @author    Thiago Belem <contato@thiagobelem.net>
	*
	* @param integer $tamanho Tamanho da senha a ser gerada
	* @param boolean $maiusculas Se terá letras maiúsculas
	* @param boolean $numeros Se terá números
	* @param boolean $simbolos Se terá símbolos
	*
	* @return string A senha gerada
	*/
	@session_start();		
	if ($_POST["funcao"] == 'removerAcento') {
		echo removerAcento($_POST["busca"]);
	}
	function timeLoad($start = null) {
		$mTime = microtime(); // Pega o microtime
		$mTime = explode(' ',$mTime); // Quebra o microtime
		$mTime = $mtime[1] + $mtime[0]; // Soma as partes montando um valor inteiro
		 
		if ($start == null)
			return $mtime;
		else
			return round($mtime - $start, 2);
	}
	
	
	switch (@$_REQUEST['valida']) {
		case 'cpf':
			validaCPF(@$_POST["cpf"]);
			break;
		case 'cnpj':
			isCnpjValid(@$_POST["cnpj"]);
			break;
	}
	
	if(@$_REQUEST['frete'] == "frete"){
		$frete = calcularFrete($_POST["cep"], $_POST["peso"], $_POST["altura"], $_POST["largura"], $_POST["comprimento"]);
		if($frete != "n"){
			$valorPac = str_replace('.',',',$frete[0]);
			$valorSedex = str_replace('.',',',$frete[1]);
			$praxoPac = str_replace('.',',',$frete[2]);
			$prazoSedex = str_replace('.',',',$frete[3]);
			echo $valorPac."-".$valorSedex."-".$praxoPac."-".$prazoSedex;
		}else{
			echo $frete;
		}
	}
			
	function geraSenha($tamanho = 10, $maiusculas = true, $numeros = true, $simbolos = false){			
			$lmin = 'abcdefghijklmnopqrstuvwxyz';
			$lmai = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			$num = '1234567890';
			$simb = '!@#$%*-';
			$retorno = '';
			$caracteres = '';
			
			$caracteres .= $lmin;
			if ($maiusculas) $caracteres .= $lmai;
			
			if ($numeros) $caracteres .= $num;
			
			if ($simbolos) $caracteres .= $simb;
			
			$len = strlen($caracteres);
			
			for ($n = 1; $n <= $tamanho; $n++) {
				$rand = mt_rand(1, $len);
				$retorno .= $caracteres[$rand-1];
			}
			return $retorno;
	}
	
	function moeda($valor){
 			 $valor =  number_format($valor/100,2,",",".");
  			 str_replace(',','%',$valor);
   			 str_replace('.',',',$valor);
  			 return str_replace('%','.',$valor);
	}
	
	function busca($_valor){
		if (FileMaker::isError($_valor)){
			if ($_valor->code == 401){
				return  0;
			}else{
				return "erro: " . $_valor->code . " - " . $_valor->getMessage();
				die();
			}
		}else{
			return $_valor->getRecords();
		}
	}

	function formata( $strCampo ){		   
		$strCampo = str_replace(",", ".", str_replace(".", "", $strCampo));
		$strCampo = number_format($strCampo,2,",",".");
        return $strCampo;
	}
	
	function formatar_cep($_cep){
		if ($_cep!="" and strlen($_cep)>1){
			$_cep = substr("00000000" . preg_replace("/[^0-9]/", "", $_cep), -8);

			return substr($_cep, 0, 2) . "" . substr($_cep, 2, 3) . "-" . substr($_cep, 5, 3);
		}
	}
	
	function buscarCep($_cep){
		$_url = "http://republicavirtual.com.br/web_cep.php?cep=" . urlencode($_cep) . "&formato=query_string";
		
		$_ch = curl_init();
		$_timeout = 0;
		curl_setopt($_ch, CURLOPT_URL, $_url);
		curl_setopt($_ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($_ch, CURLOPT_CONNECTTIMEOUT, $_timeout);
		$_site = curl_exec ($_ch);
		curl_close($_ch);
		parse_str($_site, $_array);
		
		return $_array;
	}
	
	
	function is_ssl() {
	    if ( isset($_SERVER['HTTPS']) ) {
	        if ( 'on' == strtolower($_SERVER['HTTPS']) )
	            return true;
	        if ( '1' == $_SERVER['HTTPS'] )
	            return true;
	    } elseif ( isset($_SERVER['SERVER_PORT']) && ( '443' == $_SERVER['SERVER_PORT'] ) ) {
	        return true;
	    }
	    return false;
	}
	
	function verificaSSL($_ssl){
		if (SSL=="1"){
			if ($_ssl){
				if (is_ssl()==false){
					echo"<script> window.location.href='" . rtrim(URL_SSL,"/") ."/". end(explode("/", $_SERVER["PHP_SELF"])) . "'; </script>";
					die;
				}
			}else{
				if (is_ssl()){
					echo "<script> window.location.href='" . rtrim(URL,"/") ."/". end(explode("/", $_SERVER["PHP_SELF"])) . "'; </script>";
					die;
				}
			}
		}
	}
	
	function tiraMoeda($valor){
		$pontos = array(",", ".");
		$result = str_replace($pontos, "", $valor);
		return $result;
	}
	
	function validaEmail($_email){
		$_conta = "^[a-zA-Z0-9\._-]+@";
		$_domino = "[a-zA-Z0-9\._-]+.";
		$_extensao = "([a-zA-Z]{2,4})$";
		
		if (@ereg($_conta . $_domino . $_extensao, $_email))
			return true;
		else
			return false;
	}
	
	function valorFM($_valor){
		return str_replace(",", ".", str_replace(".", "", $_valor));
	}
	
	function maiusculaFM($_valor, $_tipo="F"){
		if ($_tipo=="F"){
			$_first = utf8_encode(mb_strtoupper(substr(utf8_decode($_valor), 0, 1)));
			$_string = utf8_encode(mb_strtolower(substr(utf8_decode($_valor), 1, strlen($_valor))));
			return $_first . $_string;
		}else if ($_tipo=="FA"){
			$_array = explode(" ", $_valor);
			
			for ($_i=0; $_i<count($_array); $_i++){
				$_first = utf8_encode(mb_strtoupper(substr(utf8_decode($_array[$_i]), 0, 1)));
				$_string = utf8_encode(mb_strtolower(substr(utf8_decode($_array[$_i]), 1, strlen($_array[$_i]))));
				$_new[$_i] = $_first . $_string;
			}
			
			return (implode(" ", $_new));
		}else if ($_tipo=="U")
			return utf8_encode(mb_strtoupper(utf8_decode($_valor)));
		else if ($_tipo=="L")
			return utf8_encode(mb_strtolower(utf8_decode($_valor)));	
	}
	//*******************************************************************************************
	function calcula_pmt ($_taxa, $_parcelas, $_valorTotal){
		$_fv = 0.0;
		$_tipo = 0;
		$_pvif = (pow(1+$_taxa, $_parcelas));

		if ($_taxa==0){
			$_fvifa = $_parcelas;
		}else{
			$_fvifa = (pow(1+$_taxa, $_parcelas)-1)/$_taxa;
		}

		return round(((($_valorTotal*$_pvif-$_fv)/((1.0+$_taxa*$_tipo)*$_fvifa)))*100)/100;
	}

	//*********************************************************************************************************************************
	function get_files_dir($dir, $tipos = null){
      if(file_exists($dir)){
          $dh =  opendir($dir);
          while (false !== ($filename = readdir($dh))) {
              if($filename != '.' && $filename != '..'){
                  if(is_array($tipos)){
                      $extensao = get_extensao_file($filename);
                      if(in_array($extensao, $tipos)){
                          $files[] = $filename;
                      }
                  }
                  else{
                      $files[] = $filename;
                  }
              }
          }
          if(is_array($files)){
              sort($files);
          }
          return $files;
      }
      else{
          return false;
      }
	}
 
/**
    * Retorna a extensão de um arquivo
    * @author Rafael Wendel Pinheiro
    * @param String $nome Nome do arquivo a se capturar a extensão
    * @return resource Caminho onde foi salvo o arquivo, ou false em caso de erro
*/
	function get_extensao_file($nome){
    	$verifica = explode('.', $nome);
    	return $verifica[count($verifica) - 1];
	}


	function validaCPF($cpf){	// Verifiva se o número digitado contém todos os digitos
    	//$cpf = str_pad(ereg_replace('[^0-9]', '', $cpf), 11, '0', STR_PAD_LEFT);
		
		$j=0;
		for($i=0; $i<(strlen($cpf)); $i++)
		{
			if(is_numeric($cpf[$i]))
			{
				$num[$j]=$cpf[$i];
				$j++;
			}
		}
		
		$cpf="";
		for($i=0;$i<$j; $i++)
		{
			$cpf = $cpf.$num[$i];
		}

		// Verifica se nenhuma das sequências abaixo foi digitada, caso seja, retorna falso
    	if (strlen($cpf) != 11 || $cpf == "00000000000" || $cpf == '11111111111' || $cpf == '22222222222' || $cpf == '33333333333' || $cpf == '44444444444' || $cpf == '55555555555' || $cpf == '66666666666' || $cpf == '77777777777' || $cpf == '88888888888' || $cpf == '99999999999')
		{
			$resultado = 0;
			return $resultado;
    	}
		else
		{   // Calcula os números para verificar se o CPF é verdadeiro
        	for ($t = 9; $t < 11; $t++) {
            	for ($d = 0, $c = 0; $c < $t; $c++) {
                	$d += $cpf{$c} * (($t + 1) - $c);
            	}
 
            		$d = ((10 * $d) % 11) % 10;
 
           			 if ($cpf{$c} != $d) {
						$resultado = 0;
						return $resultado;
						exit;
            		}
        		}
				$resultado = 1;
				return $resultado;
    		}
		}
	/**
	 * isCnpjValid
	 *
	 * Esta função testa se um Cnpj é valido ou não. 
	 *
	 * @author	Raoni Botelho Sporteman <raonibs@gmail.com>
	 * @version	1.0 Debugada em 27/09/2011 no PHP 5.3.8
	 * @param	string		$cnpj			Guarda o Cnpj como ele foi digitado pelo cliente
	 * @param	array		$num			Guarda apenas os números do Cnpj
	 * @param	boolean		$isCnpjValid	Guarda o retorno da função
	 * @param	int			$multiplica 	Auxilia no Calculo dos Dígitos verificadores
	 * @param	int			$soma			Auxilia no Calculo dos Dígitos verificadores
	 * @param	int			$resto			Auxilia no Calculo dos Dígitos verificadores
	 * @param	int			$dg				Dígito verificador
	 * @return	boolean						"true" se o Cnpj é válido ou "false" caso o contrário
	 *
	 */
	 
	 function isCnpjValid($cnpj){
			//Etapa 1: Cria um array com apenas os digitos numéricos, isso permite receber o cnpj em diferentes formatos como "00.000.000/0000-00", "00000000000000", "00 000 000 0000 00" etc...
			$isCnpjValid="";
			$j=0;
			$num = null;
			for($i=0; $i<(strlen($cnpj)); $i++)
				{
					if(is_numeric($cnpj[$i]))
						{
							$num[$j]=$cnpj[$i];
							$j++;
						}
				}
			//Etapa 2: Conta os dígitos, um Cnpj válido possui 14 dígitos numéricos.
			if(count($num)!=14)
				{
					$isCnpjValid=0;
					return $isCnpjValid;
					exit;
				}
			//Etapa 3: O número 00000000000 embora não seja um cnpj real resultaria um cnpj válido após o calculo dos dígitos verificares e por isso precisa ser filtradas nesta etapa.
			if ($num[0]==0 && $num[1]==0 && $num[2]==0 && $num[3]==0 && $num[4]==0 && $num[5]==0 && $num[6]==0 && $num[7]==0 && $num[8]==0 && $num[9]==0 && $num[10]==0 && $num[11]==0)
				{
					$isCnpjValid=0;
					return $isCnpjValid;
					exit;
				}
			//Etapa 4: Calcula e compara o primeiro dígito verificador.
			else
				{
					$j=5;
					for($i=0; $i<4; $i++)
						{
							$multiplica[$i]=$num[$i]*$j;
							$j--;
						}
					$soma = array_sum($multiplica);
					$j=9;
					for($i=4; $i<12; $i++)
						{
							$multiplica[$i]=$num[$i]*$j;
							$j--;
						}
					$soma = array_sum($multiplica);	
					$resto = $soma%11;			
					if($resto<2)
						{
							$dg=0;
						}
					else
						{
							$dg=11-$resto;
						}
					if($dg!=$num[12])
						{
							$isCnpjValid=0;
							return $isCnpjValid;
							exit;
						} 
				}
			//Etapa 5: Calcula e compara o segundo dígito verificador.
			if($isCnpjValid == ""){
					$j=6;
					for($i=0; $i<5; $i++)
						{
							$multiplica[$i]=$num[$i]*$j;
							$j--;
						}
					$soma = array_sum($multiplica);
					$j=9;
					for($i=5; $i<13; $i++)
						{
							$multiplica[$i]=$num[$i]*$j;
							$j--;
						}
					$soma = array_sum($multiplica);	
					$resto = $soma%11;			
					if($resto<2)
						{
							$dg=0;
						}
					else
						{
							$dg=11-$resto;
						}
					if($dg!=$num[13])
						{
							$isCnpjValid=0;
						}
					else
						{
							$isCnpjValid=1;
						}
					return $isCnpjValid;
				}			
		}
		
	function pmt($taxa, $parcelas, $valor){

		return ($taxa * -$valor * pow((1 + $taxa), $parcelas) / (1 - pow((1 + $taxa), $parcelas)));
	}
	
	function temAcento($_string) { 
		$_regExp = "[áàâãäªÁÀÂÃÄéèêëÉÈÊËíìîïÍÌÎÏóòôõöºÓÒÔÕÖúùûüÚÙÛÜçÇÑñ;']";
		return ereg($_regExp,$_string); 
	}
	
	function removerAcento($_string) {
		$table = array(
		        'Š'=>'S', 'š'=>'s', 'Đ'=>'Dj', 'đ'=>'dj', 'Ž'=>'Z',
		        'ž'=>'z', 'Č'=>'C', 'č'=>'c', 'Ć'=>'C', 'ć'=>'c',
		        'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A',
		        'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
		        'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I',
		        'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
		        'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U',
		        'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss',
		        'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a',
		        'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e',
		        'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i',
		        'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o',
		        'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u',
		        'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b',
		        'ÿ'=>'y', 'Ŕ'=>'R', 'ŕ'=>'r', '&'=>'', '%'=>'',
	    );
	    // Traduz os caracteres em $string, baseado no vetor $table
	    $string = strtr($_string, $table); 
		// Transforma espaços e underscores em hífens
	    $string = preg_replace("/[\s_]/", "-", $string);
		// retorna a string
		
	    return $string;
	}
	
	function geraDescricaoAmigavel($string){
	    $table = array(
		        'Š'=>'S', 'š'=>'s', 'Đ'=>'Dj', 'đ'=>'dj', 'Ž'=>'Z',
		        'ž'=>'z', 'Č'=>'C', 'č'=>'c', 'Ć'=>'C', 'ć'=>'c',
		        'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A',
		        'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
		        'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I',
		        'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
		        'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U',
		        'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss',
		        'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a',
		        'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e',
		        'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i',
		        'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o',
		        'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u',
		        'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b',
		        'ÿ'=>'y', 'Ŕ'=>'R', 'ŕ'=>'r',
	    );
	    // Traduz os caracteres em $string, baseado no vetor $table
	    $string = strtr($string, $table);
	    // converte para minúsculo
	    $string = strtolower($string);
	    // remove caracteres indesejáveis (que não estão no padrão)
	    $string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
	    // Remove múltiplas ocorrências de hífens ou espaços
	    $string = preg_replace("/[\s-]+/", " ", $string);
	    // Transforma espaços e underscores em hífens
	    $string = preg_replace("/[\s_]/", "-", $string);
	    // retorna a string
	    return $string;
	}
	
	function mySubstring($_string, $_size) {
		if (strlen($_string)>$_size)
			return substr($_string, 0, $_size) . "...";
		else
			return $_string;
	}
	
	function soNumero($str) {
	    return preg_replace("/[^0-9]/", "", $str);
	}

	function sendEmail($to, $subject, $content){
		$mail = new PHPMailer(true);

		$mail->SetLanguage("br"); // Define o Idioma
		$mail->CharSet = "utf-8"; // Define a Codifica��o
		$mail->IsHTML(true); // Enviar como HTML
		$mail->IsSMTP(); // Define que a mensagem será SMTP

		try {
			$mail->Host = EMAIL_PLANDER_SMTP; // Endereço do servidor SMTP (Autenticação, utilize o host smtp.seudomínio.com.br)
			$mail->SMTPAuth   = true;  // Usar autenticação SMTP (obrigatório para smtp.seudomínio.com.br)
			$mail->Port       = PORTA_PLANDER_SMTP; //  Usar 587 porta SMTP
			$mail->Username = USUARIO_PLANDER_EMAIL; // Usuário do servidor SMTP (endereço de email)
			$mail->Password = SENHA_PLANDER_EMAIL; // Senha do servidor SMTP (senha do email usado)
		 
		    //Define o remetente
		    $mail->SetFrom(USUARIO_PLANDER_EMAIL, 'Suporte plander'); //Seu e-mail
	    	$mail->Subject = $subject;//Assunto do e-mail
		 
		    //Define os destinatário(s)
		    $mail->AddAddress($to, $to);
		 
		    //Campos abaixo são opcionais 
		    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		    $mail->AddCC(USUARIO_PLANDER_EMAIL, 'Copia'); // Copia
		    //$mail->AddBCC('destinatario_oculto@dominio.com.br', 'Destinatario2`'); // Cópia Oculta
		    //$mail->AddAttachment('images/phpmailer.gif');      // Adicionar um anexo
		 
		    //Define o corpo do email
		    $mail->MsgHTML($content); 
			//Caso queira colocar o conteudo de um arquivo utilize o método abaixo ao invés da mensagem no corpo do e-mail.
		    //$mail->MsgHTML(file_get_contents('arquivo.html'));

		    $mail->Send();
		    return 1;
	    }catch (phpmailerException $e) {
			return 0;
		}
	}
?>