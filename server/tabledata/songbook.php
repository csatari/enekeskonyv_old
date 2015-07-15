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
require_once("permissions.php");
require_once("users.php");

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
    function getById($id) {
        $sql = "SELECT * FROM ".SongbookTable::$tableName." WHERE ".SongbookTable::$idName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($id));
        $songbookTable = new SongbookTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $songbookTable;
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
    function shareSongbook($userid,$songbookid) {
        $sql = "INSERT INTO ".SongbookSharedTable::$tableName." (".SongbookSharedTable::$useridName.",".SongbookSharedTable::$songbookidName.") VALUES (?,?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid,$songbookid));
        $stmt->fetch(PDO::FETCH_ASSOC);
        return true;
    }
    function isSharedWithUser($songbookid,$userid) {
        $sql = "SELECT * FROM ".SongbookSharedTable::$tableName." WHERE ".
                SongbookSharedTable::$useridName." = ? AND ".SongbookSharedTable::$songbookidName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid,$songbookid));
        $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();
        return ($count == 0 ? false : true);
    }
    function getAllSharedSongbooksByUserid($userid) {
        $sql = "SELECT * FROM ".SongbookSharedTable::$tableName." WHERE ".
                SongbookSharedTable::$useridName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $userArray = array();
        foreach($resultArray as $result) {
            $tabla = new SongbookSharedTable($result);
            array_push($userArray,$tabla);
        }
        return $userArray;
    }

    function getAllVisibleSongbooksForUser($usertable) {
        //TODO TESZTELNI
        $permission = new Permission($this->db);
        $users = new Users($this->db);
        //admin, tehát minden énekeskönyv
        if($usertable->admin == 1) {
            $sql = "SELECT * FROM ".SongbookTable::$tableName;
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $songbookTable = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $sbArray = array();
            foreach($songbookTable as $result) {
                $tabla = new SongbookTable($result);
                $tabla = $permission->addPermissionToSongbookTable($tabla,$usertable);
                $permlevel = $permission->getPermissionOfSongbook($usertable,$tabla->id);
                $songbookOwner = $users->getById($tabla->userid);
                $tabla->username = $songbookOwner->firstname." ".$songbookOwner->lastname;
                $tabla->permissionlevel  = $permlevel;
                array_push($sbArray,$tabla);
            }
            return $sbArray;
        }
        //saját, velem megosztott, publikus - ha nem admin
        else {
            //SELECT * FROM `songbook` WHERE userid = 18 OR public = 1 OR id in 
            //(SELECT songbookid FROM `songbook-shared` WHERE userid = 18)
            $sql = "SELECT * FROM ".SongbookTable::$tableName." WHERE ".SongbookTable::$useridName." = ? OR ".SongbookTable::$publicName." = 1 OR ".SongbookTable::$idName.
                    " in (SELECT ".SongbookSharedTable::$songbookidName." FROM ".SongbookSharedTable::$tableName." WHERE ".SongbookSharedTable::$useridName." = ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(array($usertable->id,$usertable->id));
            $songbookTable = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $sbArray = array();
            foreach($songbookTable as $result) {
                $tabla = new SongbookTable($result);
                $tabla = $permission->addPermissionToSongbookTable($tabla,$usertable);
                $permlevel = $permission->getPermissionOfSongbook($usertable,$tabla->id);
                $songbookOwner = $users->getById($tabla->userid);
                $tabla->username = $songbookOwner->firstname." ".$songbookOwner->lastname;
                $tabla->permissionlevel  = $permlevel;
                array_push($sbArray,$tabla);
            }
            return $sbArray;
        }
    }
};