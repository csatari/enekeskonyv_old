<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 18:05
 */
require_once("../adatkezelok/enek.php");
$sql = new EnekSQL($db);
if(isset($_POST["cim"])) {
    $enektabla = $sql->getByTitlePart($_POST["cim"]);
    echo json_encode($enektabla);
}
else if(isset($_REQUEST["id"])) {
    $enektabla = $sql->getById($_REQUEST["id"]);
    echo json_encode($enektabla);
}

