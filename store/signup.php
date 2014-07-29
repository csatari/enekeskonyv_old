<?php
/**
 * Created by PhpStorm.
 * User: Z
 * Date: 2014.07.29.
 * Time: 13:26
 */
header('Content-Type: text/html; charset=utf-8');
if(sizeof($_POST)>0 &&( strlen($_POST["lastname"]) == 0 ||
strlen($_POST["firstname"]) == 0 ||
strlen($_POST["username"]) == 0 ||
strlen($_POST["email"]) == 0 ||
strlen($_POST["pass"]) == 0 ||
strlen($_POST["pass2"]) == 0))
echo "valamelyik üres cella!";
elseif($_POST["pass"] != $_POST["pass2"]){
    echo "Nem egyezik a két jelszó!";
}
else{
    //egyéb szerver oldali ellenőrzéseket kell végrehajtani
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
        });
        function validCheck(value,name,id){
            if(!value)warningBorder(id);
            if(value &&  $("#"+id).css("border-color","red"))$("#"+id).css("border-color","#979797")
            if(name=="email" && !IsEmail(value)&& value){errorMessage("Hibás email cím! Valmamit elgépeltél!");}
            if(name=="username" && (value.length < 5 && value.length > 0))errorMessage("Túl rövid Felhasználónév")
            if(name=="pass"&& value.length < 8 && value.length > 0)errorMessage("A jelszónak legalább 8 karakternek kell lennie");
            if(name=="pass2" && ($("#pass").val() != $("#pass2").val()))
                errorMessage("A két jelszó nem egyezik!");
        }
        function errorMessage(a){
            $("#errorMessages").text(a);
            $("#errorMessages").show(1000);
            setTimeout(function() {
                $("#errorMessages").hide(1000);
            }, 10000);
        }
        function IsEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
    <form name="input" action="signup.php" method="post">
        Név:<br><input type="text" id="lastname" name="lastname" maxlength="40" placeholder="Vezetéknév" onfocus="" onblur="validCheck(this.value,this.name,this.id)">
        <input type="text" id="firstname" name="firstname" maxlength="40" placeholder="Keresztnév" onfocus="" onblur="validCheck(this.value,this.name,this.id)"><br>
        Felhasználónév:<br><input type="text" id="username" name="username" maxlength="64" onfocus="" onblur="validCheck(this.value,this.name,this.id)"><br>
        E-mail:<br><input type="text" id="email" name="email" onfocus="" onblur="validCheck(this.value,this.name,this.id)"><br>
        Jelszó:<br><input type="password" id="pass" name="pass" onfocus="" onblur="validCheck(this.value,this.name,this.id)"><br>
        Jelszó mégegyszer:<br><input type="password" id="pass2" name="pass2" onfocus="" onblur="validCheck(this.value,this.name,this.id)"><br>
        <input type="submit" id="submit" name="submit" value="Regisztrálok" onclick="">
    </form>
</body>
</html>