<?php
/**
 * Created by PhpStorm.
 * User: Z
 * Date: 2014.07.29.
 * Time: 13:26
 */
//require_once('smtpValidateEmail.class.php');
require_once('db.php');
header('Content-Type: text/html; charset=utf-8');
date_default_timezone_set('CET');
$errorMessage="";
$done = "";

if(sizeof($_POST)>0 && strlen($_POST["lastname"]) != 0 &&
strlen($_POST["firstname"]) != 0 &&
strlen($_POST["username"]) != 0 &&
strlen($_POST["email"]) != 0 &&
strlen($_POST["pass"]) != 0){
    //Felhasználó elmentése az adatbázisba
    if(true){//if(isEmail($_POST["email"])){
        try {
            $db->beginTransaction();
            $db->exec(" INSERT INTO `users` (`id`, `lastname`, `firstname`, `username`, `email`, `pass`, `date`)
                VALUES ('', '".$_POST["lastname"]."', '".$_POST["firstname"]."', '".$_POST["username"]."', '".$_POST["email"]."', '".
                $_POST["pass"]."', '".date("Y-m-d H:i:s")."')");
            $db->commit();

        } catch (PDOException $e) {
            $db->rollBack();
        }
        $db = NULL;
        $done = '$("#coverLayer").css("display","block");$("#done").css("display","block");';
    }
    else $errorMessage = 'errorMessage("Érvénytelen a megadott e-mail cím");';
}
//Regisztrációs adatok helyességének vizsgálata

elseif(sizeof($_POST)>0){
    $errorMessage = 'errorMessage("Valamelyik cellát üresen hagytad.");';
}

function isEmail($mail){
    //FIXME "SMTP-s ellenőrző nem működik"
    $SMTP_Validator = new SMTP_validateEmail();
    $results = $SMTP_Validator->validate(array($mail));
    return $results[$mail];
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Regisztráció</title>
    <script src="../js/jquery-1.11.1.js"></script>
    <script src="js/jquery.md5.js"></script>
    <script src="js/jquery.foggy.min.js"></script>
    <script>
        $(document).ready(function() {
            $("#errorMessages").hide();
            <?php echo $errorMessage."
            ".$done."
            "; ?>
        });
        function validCheck(value,id){
            if(!value)warningBorder(id);
            if(value &&  $("#"+id).css("border-color","red"))$("#"+id).css("border-color","#979797")
            if(id=="email" && !IsEmail(value)&& value)
                errorMessage("Hibás email cím! Valmamit elgépeltél!");
            if(id=="username" && (value.length < 5 && value.length > 0))
                errorMessage("Túl rövid Felhasználónév. Legalább 5 karakternek kell lennie.");
            if(id=="pass"&& value.length < 8 && value.length > 0)
                errorMessage("A jelszónak legalább 8 karakternek kell lennie.");
            if(id=="pass2" && ($("#pass").val() != $("#pass2").val()))
                errorMessage("A két jelszó nem egyezik.");
            if(id=="submit"){
                if(!$("#lastname").val() || !$("#firstname").val() || !$("#username").val() || !$("#email").val() || !$("#pass").val() || !$("#pass2").val()){
                    errorMessage("Üresen hagytál legalább 1 cellát.");
                    return false;
                }
                if($("#username").val().length < 5){
                    errorMessage("Túl rövid Felhasználónév. Legalább 5 karakternek kell lennie.");
                    warningBorder("username");
                    return false;
                }
                if(!IsEmail($("#email").val())){
                    errorMessage("Hibás email cím! Valmamit elgépeltél!");
                    warningBorder("email");
                    return false;
                }
                if($("#pass").val() != $("#pass2").val()){
                    errorMessage("A két jelszó nem egyezik.");
                    warningBorder("pass");
                    warningBorder("pass2");
                    return false;
                }
                if($("#pass").val().length < 8){
                    errorMessage("A jelszónak legalább 8 karakternek kell lennie.");
                    return false;
                }
                else return true;
            }
        }
        function errorMessage(a){
            $("#errorMessages").hide();
            $("#errorMessages").text(a);
            $("#errorMessages").show(800);
            setTimeout(function() {
                $("#errorMessages").hide(800);
            }, 10000);
        }
        function IsEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            //regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return regex.test(email);
        }
        function warningBorder(id){
            $("#"+id).css("border-color","red");
        }
        function sendData(){
            if(validCheck('a','submit')){
                $.ajax({
                    type: "POST",
                    url:"signup.php",
                    data: {
                        "lastname": $("#lastname").val(),
                        "firstname": $("#firstname").val(),
                        "username": $("#username").val(),
                        "email": $("#email").val(),
                        "pass": $.md5($("#pass").val())
                    }
                }).done(function(e) {
                     $("#coverLayer").fadeIn(1000);
                     $("#done").fadeIn(1000);
                     $('#base').foggy();
                });
            }
        }
    </script>
    <link rel="stylesheet" type="text/css" href="css/signup.css">
</head>
<body>
    <div id="base">
        <h1>Fiók létrehozása</h1>
        <div id="errorMessages"></div>
        <form id="input" name="input">
            Név:<br><input type="text" id="lastname" name="lastname" maxlength="40" placeholder="Vezetéknév" onfocus="" onblur="validCheck(this.value,this.id)">
            <input type="text" id="firstname" name="firstname" maxlength="40" placeholder="Keresztnév" onfocus="" onblur="validCheck(this.value,this.id)"><br>
            Felhasználónév:<br><input type="text" id="username" name="username" maxlength="64" onfocus="" onblur="validCheck(this.value,this.id)"><br>
            E-mail:<br><input type="text" id="email" name="email" onfocus="" onblur="validCheck(this.value,this.id)"><br>
            Jelszó:<br><input type="password" id="pass" name="pass" onfocus="" onblur="validCheck(this.value,this.id)"><br>
            Jelszó mégegyszer:<br><input type="password" id="pass2" name="pass2" onfocus="" onblur="validCheck(this.value,this.id)"><br>
            <input type="button" id="submit" name="submit" class="gomb" value="Regisztrálok" onclick="sendData()">
        </form>
        <div id="backgroundImage"></div>
    </div>
    <div id="coverLayer"></div>
    <div id="done">
        <h2>Sikeres Regisztráció</h2>
        Ezután lehetőséged van saját énekeskönyveket létrehozni, módosítani és letölteni. Így offline is használhatod. De akár új énekeket is feltölthetsz, több verzióban is.<br>
        <button onclick="location.href='index.php'" class="gomb">Bejelentkezés</button>
    </div>
</body>
</html>