<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 14:09
 */
$db;
try {
    /**
     * Csatlakozik az adatbázishoz
     */
    $db = new PDO('mysql:host=localhost;dbname=enekeskonyv;charset=utf8', 'enekeskonyvfelh', '12345', array(
        PDO::ATTR_PERSISTENT => true
    ));
} catch (PDOException $e) {
    echo 'Nem sikerült a csatlakozás: ' . $e->getMessage();
}
session_start();
function checkIfValid() {
    if($_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
        if(@isset($_SERVER['HTTP_REFERER'])/* && $_SERVER['HTTP_REFERER']=="http://yourdomain/ajaxurl"*/)
        {
            if(!isset($_POST['token']) || !isset($_SESSION['token'])) {
                return false;
            }
            if($_POST['token'] == $_SESSION['token']) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}