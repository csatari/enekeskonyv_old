<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.20.
 * Time: 16:21
 */
header('Content-Type: text/html; charset=utf-8');
require_once("../adatkezelok/enek.php");
if(checkIfValid()) {
    $sql = new EnekSQL($db);
    $cim = "";
    $szoveg = "";
    $kotta = "";
    $nyelv = 0;
    if(isset($_POST['cim'])) { $cim = $_POST['cim']; }
    if(isset($_POST['szoveg'])) { $szoveg = $_POST['szoveg']; }
    if(isset($_POST['kotta'])) { $kotta = $_POST['kotta']; }
    if(isset($_POST['nyelv'])) { $nyelv = $_POST['nyelv']; }
    if(isset($_POST['masnyelven'])) { $masnyelven = $_POST['masnyelven']; }
    if(isset($_POST['cimkek'])) { $cimkek = $_POST['cimkek']; }
    if(isset($_POST['megjegyzes'])) { $megjegyzes = $_POST['megjegyzes']; }

    $sql->add($cim,$szoveg,$kotta,$nyelv,$masnyelven,$cimkek,$megjegyzes);
}
else { echo "problem";}