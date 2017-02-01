<?php
session_start();

create_image();
exit();

function create_image(){

    /*$md5_hash = md5(rand(0,999));
	 
    $security_code = substr($md5_hash, 15, 5); 

    $_SESSION["security_code"] = $security_code;*/

    $image = @imagecreatefromjpeg("images/static.jpg");  

    $black = ImageColorAllocate($image, 0, 0, 0);

	$vPos = 3;
	$hPos = 14; // set 5 
	$fontSize = 5;
	
    ImageString($image, $fontSize, $hPos, $vPos, $_SESSION["security_code"], $black); 
 
    header("Content-Type: image/jpeg"); 

    ImageJpeg($image);
   
    ImageDestroy($image);
}
?>