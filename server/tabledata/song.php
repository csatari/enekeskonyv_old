<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 14:18
 */
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("language.php");
require_once("tableobjects.php");
require_once("permissions.php");

class Song {


    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    /**
     * Hozzáad egy sort az énekeket tartalmazó táblához
     * @param $cim
     * @param $leiro
     * @param $kotta
     */
    function add($userTable,$songid,$cim,$leiro,$kotta,$nyelv,$masnyelven,$cimkek,$megjegyzes) {
        $nextId = $songid;
        $version = 1;
        $permission = new Permission($this->db);
        //új ének létrehozása
        if($songid == 0) {
            //jogi ellenőrzés készítésre
            if(!$permission->isOperationValidForUserSong($userTable,$songid,SongOperation::Create)) {
                return 0; //nincs jog
            }
            $nextId = $this->getNextId();
            
        }
        //új verzió létrehozása
        else {
            //jogi ellenőrzés módosításra
            if(!$permission->isOperationValidForUserSong($userTable,$songid,SongOperation::Edit)) {
                return 0; //nincs jog
            }
            $song = $this->getById($songid);
            $version = $song->version+1;
        }
        $sql = "INSERT INTO ".SongTable::$tableName." (".SongTable::$idName.",".SongTable::$versionName.",".SongTable::$creatorName.",".SongTable::$titleName.",".SongTable::$textName.",".SongTable::$notesName.",".SongTable::$langName.",".SongTable::$otherlangName.",".SongTable::$labelsName.",".SongTable::$commentName.") VALUES (?,?,?,?,?,?,?,?,?,?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($nextId,$version,$userTable->id,$cim,$leiro,$kotta,$nyelv,$masnyelven,$cimkek,$megjegyzes));
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $nextId;
    }
    public function getLast() {
        $sql = "SELECT * FROM ".SongTable::$tableName." ORDER BY ".SongTable::$idName." DESC LIMIT 0,1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $songtable = new SongTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $songtable;
    }

    /**
     * Lekérdez egy éneket id alapján
     * @param $id
     * @return SongTable
     */
    function getById($id) {
        $sql = "SELECT * FROM ".SongTable::$tableName." WHERE ".SongTable::$idName." = ? ORDER BY ".SongTable::$versionName." DESC LIMIT 0,1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($id));
        $enektabla = new SongTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $enektabla;
    }

    /**
     * Lekérdez több éneket tartalmazó sort, aszerint, hogy a cím tartalmazza-e a paramétert (LIKE, nem = )
     * @param $title
     * @return array
     */
    function getByTitlePartOld($title) {
        $title = "%".$title."%";
        $sql = "SELECT * FROM ".SongTable::$tableName." WHERE ".SongTable::$titleName." LIKE ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($title));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $enekTablaArray = array();
        foreach($resultArray as $result) {
            $enektabla = new SongTable($result);
            $lang = new Language($this->db);
            $langName = $lang->getById($enektabla->language)->name;
            if($enektabla->labels == "") {
                $enektabla->labels = array($langName);
            }
            else {
                $labelParts = explode(",",$enektabla->labels);
                if($labelParts) {
                    array_unshift($labelParts,$langName);
                    $enektabla->labels = $labelParts;
                }
            }
            array_push($enekTablaArray,$enektabla);
        }
        return $enekTablaArray;
    }

    function getByTitlePartNew($title) {
        $title = "%".$title."%";
        $sql = "SELECT * FROM ".SongTable::$tableName." WHERE ".SongTable::$titleName." LIKE ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($title));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $idArray = array();
        foreach($resultArray as $result) {
            $enektabla = new SongTable($result);
            array_push($idArray,$enektabla->id);
        }
        return $idArray;
    }
    function getByLabelToIdArray($label) {
        $likelabel = "%".$label."%";
        $sql = "SELECT * FROM ".SongTable::$tableName." WHERE ".SongTable::$labelsName." LIKE ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($likelabel));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $idArray = array();
        foreach($resultArray as $result) {
            $enektabla = new SongTable($result);
            array_push($idArray,$enektabla->id);
        }
        return $idArray;
    }
    function getByLanguageToIdArray($langName) {
        $lang = new Language($this->db);
        $langTable = $lang->getByName($langName);
        if($langTable->id == null) {
            return array();
        }
        $langId = $langTable->id;
        $sql = "SELECT * FROM ".SongTable::$tableName." WHERE ".SongTable::$langName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($langId));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $idArray = array();
        foreach($resultArray as $result) {
            $enektabla = new SongTable($result);
            array_push($idArray,$enektabla->id);
        }
        return $idArray;
    }

    function getAll() {
        $sql = "SELECT * FROM ".SongTable::$tableName;
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $enekTablaArray = array();
        foreach($resultArray as $result) {
            $enektabla = new SongTable($result);
            array_push($enekTablaArray,$enektabla);
        }
        return $enekTablaArray;
    }
    function getSongsFromArray($array,$usertable) {
        $enekTablaArray = array();
        $permissions = new Permission($this->db);
        foreach($array as $enekid => $value) {
            $enektabla = $this->getById($enekid);
            $lang = new Language($this->db);
            $langName = $lang->getById($enektabla->language)->name;
            if($enektabla->labels == "") {
                $enektabla->labels = array($langName);
            }
            else {
                $labelParts = explode(",",$enektabla->labels);
                if($labelParts) {
                    array_unshift($labelParts,$langName);
                    $enektabla->labels = $labelParts;
                }
            }
            $enektabla = $permissions->addPermissionToSongTable($enektabla, $usertable);
            array_push($enekTablaArray,$enektabla);
        }
        return $enekTablaArray;
    }
    function getNextId() {
        $sql = "SELECT ".SongTable::$idName." FROM ".SongTable::$tableName." ORDER BY ".SongTable::$idName." DESC LIMIT 0,1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $idArray = $stmt->fetch(PDO::FETCH_ASSOC);
        return $idArray[SongTable::$idName]+1;
    }
    function extendPermissions($songTable,$userTable) {
        $permissions = new Permission($this->db);
        $songTable = $permissions->addPermissionToSongTable($songTable, $userTable);
        return $songTable;
    }
    function extendLabels($songTable) {
        $lang = new Language($this->db);
        $langName = $lang->getById($songTable->language)->name;
        if($songTable->labels == "") {
            $songTable->labels = array($langName);
        }
        else {
            $labelParts = explode(",",$songTable->labels);
            if($labelParts) {
                array_unshift($labelParts,$langName);
                $songTable->labels = $labelParts;
            }
        }
        return $songTable;
    }
};