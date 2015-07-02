<?php
require_once("/tabledata/users.php");
require_once("error.php");
$users = new Users($db);
$salt = "NoS9SWYCuZ9mhQU0ahKug21RDjeFoKHfZh7lLNY1PpQ2VIsq9maiyORgqzvfJUWm";
// username, password
if(isset($_REQUEST["username"]) && isset($_REQUEST["password"])) {
    $pass = crypt ( $_REQUEST["password"], $salt);
    $usertable = $users->getByUsername($_REQUEST["username"]);
    if($usertable == null) {
        echo json_encode(new ErrorTable("Nincs ilyen felhasználónév"));
        return;
    }
    $result = $users->isPasswordSame($usertable,$pass);
    if($result) {
        $sessionid = $users->login($usertable);
        echo json_encode(array("sessionid" => $sessionid));
    }
    else {
    	echo json_encode(new ErrorTable("Rossz a jelszó "));
    }
}
else if(isset($_REQUEST["sessionid"]) && isset($_REQUEST["logout"])) {
    //logout
    $users->deleteSession($_REQUEST["sessionid"]);
    echo "true";
}
else if(isset($_REQUEST["sessionid"])) {
    $result = $users->isSessionidExists($_REQUEST["sessionid"]);
    if($result) {
        echo "true";
    }
    else {
        echo "false";
    }
}