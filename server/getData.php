<?php
require_once("/tabledata/language.php");
require_once("error.php");
$language = new Language($db);
if(!isset($_REQUEST["sessionid"]) || $_REQUEST["sessionid"] == "") {
    echo json_encode(new ErrorTable("Hiányzó sessionid!"));
    return;
}
else {
    if(!checkIfValidSession($db,$_REQUEST["sessionid"])) {
        echo json_encode(new ErrorTable("Lejárt sessionid!"));
        return;
    }
}
if(isset($_REQUEST["allLanguages"])) {
    $result = $language->getAll();
    if($result != null) {
        echo json_encode($result);
    }
    else {
        echo json_encode(new ErrorTable("Hibás sessionid!"));
    }
}