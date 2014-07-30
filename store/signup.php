<?php
/**
 * Created by PhpStorm.
 * User: Z
 * Date: 2014.07.29.
 * Time: 13:26
 */
header('Content-Type: text/html; charset=utf-8');
date_default_timezone_set('CET');
$errorMessage="";
$done = "";

if(sizeof($_POST)>0 && strlen($_POST["lastname"]) != 0 &&
strlen($_POST["firstname"]) != 0 &&
strlen($_POST["username"]) != 0 &&
strlen($_POST["email"]) != 0 && isEmail($_POST["email"]) &&
strlen($_POST["pass"]) != 0 &&
strlen($_POST["pass2"]) != 0){
    //Felhasználó elmentése az adatbázisba
    try {
        /*
         *  --
         *  -- Tábla szerkezet ehhez a táblához `users`
         *  --
         *
         *  CREATE TABLE IF NOT EXISTS `users` (
         *    `id` bigint(11) NOT NULL AUTO_INCREMENT,
         *    `lastname` varchar(40) COLLATE utf8_hungarian_ci NOT NULL,
         *    `firstname` varchar(40) COLLATE utf8_hungarian_ci NOT NULL,
         *    `username` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
         *    `email` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
         *    `pass` varchar(32) COLLATE utf8_hungarian_ci NOT NULL,
         *    `date` datetime NOT NULL,
         *    PRIMARY KEY (`id`)
         *  ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci COMMENT='A felhasználók itt vannak eltárolva'
         * AUTO_INCREMENT=1 ;
         */
        $db = new PDO('mysql:host=localhost;dbname=enekeskonyv', 'user', '',
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->beginTransaction();
        $db->exec(" INSERT INTO `users` (`id`, `lastname`, `firstname`, `username`, `email`, `pass`, `date`)
        VALUES ('', '".$_POST["lastname"]."', '".$_POST["firstname"]."', '".$_POST["username"]."', '".$_POST["email"]."', '".
        md5($_POST["pass"])."', '".date("Y-m-d H:i:s")."')");
        $db->commit();

    } catch (PDOException $e) {
        $db->rollBack();
    }
    $db = NULL;
    $done = '$("#coverLayer").css("display","block");$("#done").css("display","block");';
}
//Regisztrációs adatok helyességének vizsgálata
elseif(isset($_POST["pass"])&& ($_POST["pass"] != $_POST["pass2"])){
    $errorMessage = 'errorMessage("A két jelszó nem egyezik.");';
}
elseif(sizeof($_POST)>0){
    $errorMessage = 'errorMessage("Valamelyik cellát üresen hagytad.");';
}

function isEmail(){
    /*
     * Itt kellene az e-mail cím valódiságát ellenőrizni
     * Eddig még nem találtam kifogástalanul működőt ami az SMTP protokollon keresztül lekérdezi a szolgálttót,
     * hogy be van e nála jegyezve az adott e-mail cím
     */
    return true;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Regisztráció</title>
    <script src="../js/jquery-1.11.1.js"></script>
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
            if(id=="input"){
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
    </script>
    <link rel="stylesheet" type="text/css" href="css/signup.css">
</head>
<body>
    <h1>Fiók létrehozása</h1>
    <div id="errorMessages"></div>
    <form id="input" name="input" action="signup.php" method="post" onsubmit="return validCheck(this.value,this.id)">
        Név:<br><input type="text" id="lastname" name="lastname" maxlength="40" placeholder="Vezetéknév" onfocus="" onblur="validCheck(this.value,this.id)">
        <input type="text" id="firstname" name="firstname" maxlength="40" placeholder="Keresztnév" onfocus="" onblur="validCheck(this.value,this.id)"><br>
        Felhasználónév:<br><input type="text" id="username" name="username" maxlength="64" onfocus="" onblur="validCheck(this.value,this.id)"><br>
        E-mail:<br><input type="text" id="email" name="email" onfocus="" onblur="validCheck(this.value,this.id)"><br>
        Jelszó:<br><input type="password" id="pass" name="pass" onfocus="" onblur="validCheck(this.value,this.id)"><br>
        Jelszó mégegyszer:<br><input type="password" id="pass2" name="pass2" onfocus="" onblur="validCheck(this.value,this.id)"><br>
        <input type="submit" id="submit" name="submit" class="gomb" value="Regisztrálok">
    </form>
<div id="coverLayer"></div>
<div id="done">
    <h2>Sikeres Regisztráció</h2>
    Ezután lehetőséged van saját énekeskönyveket létrehozni, módosítani és letölteni. Így offline is használhatod. De akár új énekeket is feltölthetsz, akár több verzióban is.<br>
    <button onclick="location.href='index.php'" class="gomb">Bejelentkezés</button>
</div>
</body>
</html>