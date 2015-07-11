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
    function add($creator,$cim,$leiro,$kotta,$nyelv,$masnyelven,$cimkek,$megjegyzes) {
        $sql = "INSERT INTO ".SongTable::$tableName." (".SongTable::$creatorName.",".SongTable::$titleName.",".SongTable::$textName.",".SongTable::$notesName.",".SongTable::$langName.",".SongTable::$otherlangName.",".SongTable::$labelsName.",".SongTable::$commentName.") VALUES (?,?,?,?,?,?,?,?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($creator,$cim,$leiro,$kotta,$nyelv,$masnyelven,$cimkek,$megjegyzes));
        $stmt->fetch(PDO::FETCH_ASSOC);
        return $this->getLast()->id;
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
        $sql = "SELECT * FROM ".SongTable::$tableName." WHERE ".SongTable::$idName." = ?";
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
    function getSongsFromArray($array) {
        $enekTablaArray = array();
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
            array_push($enekTablaArray,$enektabla);
        }
        return $enekTablaArray;
    }
};