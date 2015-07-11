<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.20.
 * Time: 16:21
 */
header('Content-Type: text/html; charset=utf-8');
require_once("/tabledata/song.php");
require_once("error.php");
$song = new Song($db);
$users = new Users($db);
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

if(isset($_REQUEST["addSong"])) {
    $cim = "";
    $szoveg = "";
    $kotta = "";
    $nyelv = 0;
    $masnyelven = "";
    $cimkek = "";
    $megjegyzes = "";
    if(isset($_REQUEST['title']) && $_REQUEST["title"] != "")  { 
        $cim = $_REQUEST['title']; 
    }
    else {
        echo json_encode(new ErrorTable("Címet kötelező megadni"));
        return;
    }
    if(isset($_REQUEST['text'])) { $szoveg = $_REQUEST['text']; }
    if(isset($_REQUEST['notes'])) { $kotta = $_REQUEST['notes']; }
    if(isset($_REQUEST['lang']) && $_REQUEST["lang"] != "") { 
        $nyelv = intval($_REQUEST['lang']); 
    }
    else {
        echo json_encode(new ErrorTable("Nyelvet kötelező választani"));
        return;
    }
    if(isset($_REQUEST['otherlang'])) { $masnyelven = $_REQUEST['otherlang']; }
    if(isset($_REQUEST['labels'])) { $cimkek = $_REQUEST['labels']; }
    if(isset($_REQUEST['comment'])) { $megjegyzes = $_REQUEST['comment']; }
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $id = $song->add($usertable->id,$cim,$szoveg,$kotta,$nyelv,$masnyelven,$cimkek,$megjegyzes);
    echo json_encode($id);
}
else if(isset($_REQUEST["searchSong"])) {
    if(isset($_REQUEST['title']) && $_REQUEST["title"] != "")  { 
        $cim = $_REQUEST['title']; 
    }
    else {
        echo json_encode(new ErrorTable("Nincs megadva cím"));
        return;
    }
    $searchArray = array();
    $cimek = explode(" ",$cim);
    //print_r($cimek);
    foreach($cimek as $egyCim) {
        if($egyCim == null) continue;
        $enekIdk = array();
        if($egyCim[0] == '#') {
            $cimke = substr($egyCim,1);
            $enekIdk = $song->getByLabelToIdArray($cimke);
            $megegyidk = $song->getByLanguageToIdArray($cimke);
            $searchArray = addToSearchArray($searchArray, $megegyidk);
        }
        else {
            $enekIdk = $song->getByTitlePartNew($egyCim);
            
        }
        $searchArray = addToSearchArray($searchArray, $enekIdk);
        
    }
    arsort($searchArray);

    $res = $song->getSongsFromArray($searchArray);
    echo json_encode($res);
    //$songs = $song->getByTitlePartOld($_REQUEST["title"]);
    //echo json_encode($songs);
}
else if(isset($_REQUEST["getSong"])) {
    $songTable = $song->getById($_REQUEST["getSong"]);
    if($songTable->id == null) {
        echo json_encode(new ErrorTable("Nincs ilyen ének"));
    }
    else {
        echo json_encode($songTable);
    }
}

/**
** Az első paraméterben egy olyan tömb van, ahol az index jelenti az ének id-t, az érték pedig, hogy hány találat van rá
** A második paraméterben egy ének id-kből álló tömb van, ezt adom hozzá az előzőhöz
**/
function addToSearchArray($array,$addArray) {
    foreach ($addArray as $value) {
        if(!isset($array[$value])) {
            $array[$value] = 1;
        }
        else {
            $array[$value]++;
        }
    }
    return $array;
}