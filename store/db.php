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