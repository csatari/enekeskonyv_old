<?php
require_once("/tabledata/users.php");
require_once("/tabledata/songbook.php");
require_once("/tabledata/themes.php");
require_once("error.php");
$users = new Users($db);
$songbook = new Songbook($db);
$themes = new Themes($db);
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
else if(isset($_REQUEST["get-themes"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $result = $themes->getAllForUser($usertable->id);
    if($result) {
        echo json_encode($result);
    }
    else {
        echo json_encode(new ErrorTable("Nincs téma"));
    }
}
else if(isset($_REQUEST["add-theme"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $result = $themes->saveTheme($_REQUEST["theme-id"],$usertable->id,$_REQUEST["theme-name"],$_REQUEST["theme-public"],$_REQUEST["theme"]);
    if($result) {
        echo $result;
    }
    else {
        echo json_encode(new ErrorTable("Már van ilyen nevű témád!"));
    }
}
else if(isset($_REQUEST["set-theme"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $result = $users->updateTheme($usertable->id,$_REQUEST["set-theme"]);
    echo "true";
}
else if(isset($_REQUEST["get-theme"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    echo $usertable->theme;
}
else if(isset($_REQUEST["get-all-visible-songbooks"])) {
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $songbooks = $songbook->getAllVisibleSongbooksForUser($usertable);
    echo json_encode($songbooks);
}