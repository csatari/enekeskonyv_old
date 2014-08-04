<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 18:05
 */
require_once("../adatkezelok/enek.php");
$sql = new EnekSQL($db);
//$sql->add("ebben is benne van, hogy cím","ez meg egy leíró", "na ez meg egy kotta");
$enektabla = $sql->getByTitlePart($_POST["cim"]);
echo json_encode($enektabla);