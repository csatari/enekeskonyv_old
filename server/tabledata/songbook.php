<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.04.
 * Time: 23:29
 */
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");

class Songbook {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    /**
    * Hozzáad egy énekeskönyvet az adatbázishoz. True-val tér vissza, ha sikerül, False, ha nem (az adott usernek már van ilyen nevű énekeskönyve)
    **/
    function add($cim,$userid) {
        //Már létezik ezen a néven ennek a felhasználónak énekeskönyve
        if($this->isSongbookExists($userid,$cim)) {
            return false;
        }
        $sql = "INSERT INTO ".SongbookTable::$tableName." (".SongbookTable::$titleName.",".SongbookTable::$useridName.") VALUES (?,?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($cim,$userid));
        $stmt->fetch(PDO::FETCH_ASSOC);
        return true;
    }
    function getAllByUserid($userid) {
        $sql = "SELECT * FROM ".SongbookTable::$tableName." WHERE ".SongbookTable::$useridName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $enekeskonyvTablaArray = array();
        foreach($resultArray as $result) {
            $tabla = new SongbookTable($result);
            array_push($enekeskonyvTablaArray,$tabla);
        }
        return $enekeskonyvTablaArray;
    }
    function isSongbookExists($userid,$songbook) {
        $sql = "SELECT ".SongbookTable::$titleName." FROM ".SongbookTable::$tableName." WHERE ".
                SongbookTable::$useridName." = ? AND ".SongbookTable::$titleName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid,$songbook));
        $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();
        return ($count == 0 ? false : true);
    }
};