<?php
require_once("/tabledata/users.php");
require_once("/tabledata/songbook.php");
require_once("error.php");
$users = new Users($db);
$songbook = new Songbook($db);
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
if(isset($_REQUEST["name"])) {
    $result = $users->getBySession($_REQUEST["sessionid"]);
    if($result != null) {
        echo json_encode(array("firstname" => $result->firstname, "lastname" => $result->lastname));
    }
    else {
        echo json_encode(new ErrorTable("Hibás sessionid!"));
    }
}
else if(isset($_REQUEST["get-songbooks"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $songbooks = $songbook->getAllByUserid($usertable->id);
    if($songbooks != null) {
        echo json_encode($songbooks);
    }
    else {
        echo json_encode(new ErrorTable("Nincs énekeskönyv"));
    }
}
else if(isset($_REQUEST["add-songbook"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $result = $songbook->add($_REQUEST["add-songbook"],$usertable->id);
    if($result) {
        echo "true";
    }
    else {
        echo json_encode(new ErrorTable("Már van ilyen énekeskönyved!"));
    }
    
}