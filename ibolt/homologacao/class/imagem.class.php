<?php

class Imagem {

	private	$imagem, $largura, $altura;

	function __construct($arquivo){
		list($this->largura,$this->altura,$tipo) = getimagesize($arquivo);
		switch($tipo){
		case 1:
			$this->imagem = imagecreatefromgif($arquivo);
			break;
		case 2:
			$this->imagem = imagecreatefromjpeg($arquivo);
			break;
		case 3:
			$this->imagem = imagecreatefrompng($arquivo);
			break;
		}
	}

	function colocaLogo($logo, $alpha=100){
		list($largura,$altura,$tipo) = getimagesize($logo);
		switch($tipo){
		case 1:
			$img = imagecreatefromgif($logo);
			break;
		case 2:
			$img = imagecreatefromjpeg($logo);
			break;
		case 3:
			$img = imagecreatefrompng($logo);
			break;
		}

		$x = intval(($this->largura/100)*40);
		$y = intval(($this->altura/100)*40);

		$novaImg = imagecreatetruecolor($x,$y);
		imagecopyresampled($novaImg,$img,0,0,0,0,$x,$y,$largura,$altura);
		imagedestroy($img);
		$img = $novaImg;
		$largura = $x;
		$altura = $y;

		imagecopymerge($this->imagem, $img, $this->largura-$largura, $this->altura-$altura, 0, 0, $largura, $altura, $alpha);
	}

	function redimensionar($larguraFundo, $alturaFundo=NULL, $fill=0){
		$fundo = imagecreatetruecolor($larguraFundo, $alturaFundo);
		
		if ($fill==1)
			$cor = imagecolorallocate($fundo, 0, 0, 0);
		else
			$cor = imagecolorallocate($fundo, 255, 255, 255);
		
		imagefill($fundo, 0, 0, $cor);

		$_proporcao = max((($this->largura-$larguraFundo)/$this->largura*100),(($this->altura-$alturaFundo)/$this->altura*100));

		$larguraNova = $this->largura-round(($this->largura*$_proporcao)/100*100)/100;
		$alturaNova = $this->altura-round(($this->altura*$_proporcao)/100*100)/100;

		$imgTemp = imagecreatetruecolor($larguraNova, $alturaNova);

		imagecopyresampled ($imgTemp, $this->imagem, 0, 0, 0, 0, $larguraNova, $alturaNova, $this->largura, $this->altura);
		$this->imagem = $imgTemp;

		$x = ($larguraFundo/2)-($larguraNova/2);
		$y = ($alturaFundo/2)-($alturaNova/2);

		imagecopy($fundo, $this->imagem, $x, $y, 0, 0, $larguraNova, $alturaNova);
		$this->imagem = $fundo;
	}
	
	function filter($tipo=NULL, $valor=100){
		if ($tipo=="contraste")
			imagefilter($this->imagem, IMG_FILTER_CONTRAST, $valor);
	}

	function show(){
		imagejpeg($this->imagem);
	}
	
	function save($_path=NULL){
		if ($_path!=NULL)
			imagejpeg($this->imagem, $_path);
	}

	function escreve($arquivo,$qualidade=70){
		imagejpeg($this->imagem,$arquivo,$qualidade);
	}

	function __destruct(){
		imagedestroy($this->imagem);
	}
}

?>
