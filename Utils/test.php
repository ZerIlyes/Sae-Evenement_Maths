<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception; 
    function sendMail($email){ 

    require ('../Utils/phpMailer/src/Exception.php');
    require ('../Utils/phpMailer/src/PHPMailer.php');
    require ('../Utils/phpMailer/src/SMTP.php');

    $mail = new PHPMailer();  
    $mail->SMTPDebug = 2;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';             
    $mail->Port = 587;                         
    $mail->SMTPAuth = true;                       
    $mail->Username   =  'animath.ge@gmail.com';   
    $mail->Password   =  'unqxpztuasurffel'; 
    $mail->CharSet = 'UTF-8';
    $mail->SMTPSecure = "tls";
    $mail->From       =  'animath.ge@gmail.com';                
    $mail->FromName   = 'Contact de animathx'; 
    
    $mail->addAddress($email,"Nom");
    $mail->isHTML(true);

    $mail->Subject = "Mot de passe oublié Animath";
    $lien = 'lien';
    $mail->Body =
    "
    <h1> Reinitialisation de votre mot de passe Animath </h1>
    <p> Bonjour, vous avez demander a changer votre mot de passe, cliquez sur le lien ci-dessous pour le reintialiser</p>
    ".$lien;
    $mail->AltBody = "Test 2 or 3";

    try {
        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
    }
    sendMail('aramis.allonsius@gmail.com');
    ?>