<?php
require_once("/tabledata/users.php");
require_once("/tabledata/songbook.php");
require_once("/tabledata/song.php");
require_once("error.php");
$users = new Users($db);
$songbook = new Songbook($db);
$song = new Song($db);
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
if(isset($_REQUEST["add-song-to-songbook"])) {
	$songbook->addSongToSongbook($_REQUEST["songbook"], $_REQUEST["song"]);
    echo "true";
}
else if(isset($_REQUEST["is-song-in-songbook"])) {
    if($songbook->isSongInSongbook($_REQUEST["songbook"], $_REQUEST["song"])) {
    	echo "true";
    }
    else {
    	echo "false";
    }
}
else if(isset($_REQUEST["remove-song-from-songbook"])) {
    $songbook->removeSongFromSongbook($_REQUEST["songbook"], $_REQUEST["song"]);
    echo "true";
}
else if(isset($_REQUEST["get-all-songs-from-songbook"])) {
    $result = $songbook->getAllSongsFromSongbook($_REQUEST["songbook"]);
    $usertable = $users->getBySession($_REQUEST["sessionid"]);
    $songArray = array();
    foreach($result as $songbook) {
        $s = $song->getById($songbook->song);
        $s = $song->extendPermissions($s,$usertable);
        $s = $song->extendLabels($s);
        array_push($songArray,$s);
    }
    echo json_encode($songArray);
}
else if(isset($_REQUEST["get-songbook-count"])) {
    echo $songbook->countSongsFromSongbook($_REQUEST["songbook"]);
}
else if(isset($_REQUEST["get-songbook-data"])) { //lekéri az énekek számát és a címet
    $sb = $songbook->getById($_REQUEST["songbook"]);
    $sb->songnumber = $songbook->countSongsFromSongbook($_REQUEST["songbook"]);
    echo json_encode($sb);
}

