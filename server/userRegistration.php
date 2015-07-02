<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 18:05
 */
require_once("/tabledata/users.php");
$users = new Users($db);
$salt = "NoS9SWYCuZ9mhQU0ahKug21RDjeFoKHfZh7lLNY1PpQ2VIsq9maiyORgqzvfJUWm";
// firstname, lastname, username, email, password
if(isset($_REQUEST["firstname"])) {
    $pass = crypt ( $_REQUEST["password"], $salt);
    $result = $users->add($_REQUEST["firstname"],$_REQUEST["lastname"],$_REQUEST["username"],$_REQUEST["email"],$pass);
    if($result) {
    	echo "true";
    }
    else {
    	echo "false";
    }
}
else if(isset($_REQUEST["username"])) {
    $result = $users->isUsernameExists($_REQUEST["username"]);
    if($result) {
        echo "true";
    }
    else {
        echo "false";
    }
}

