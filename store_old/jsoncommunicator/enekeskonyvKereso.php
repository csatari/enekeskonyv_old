<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.04.
 * Time: 23:35
 */
require_once("../adatkezelok/enekeskonyv.php");
$sql = new EnekeskonyvSQL($db);
if(isset($_POST["get"])) {
    $tabla = $sql->getAllByUserid($_POST["userid"]);
    echo json_encode($tabla);
}
if(isset($_POST["add"])) {
    $sql->add($_POST["add"],$_POST["userid"]);
}