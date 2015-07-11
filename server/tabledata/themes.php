<?php
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");


class Themes {


    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    function getAllForUser($userid) {
        $sql = "SELECT * FROM ".ThemesTable::$tableName." WHERE ".ThemesTable::$creatorName." = ? OR ".ThemesTable::$publicName." = 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $tableArray = array();
        foreach($resultArray as $result) {
            $table = new ThemesTable($result);
            array_push($tableArray,$table);
        }
        return $tableArray;
    }
    function saveTheme($themeid,$userid,$name,$public,$theme) {
        if($themeid == "") {
            //Már létezik ezen a néven ennek a felhasználónak témája
            if($this->isThemeExistsForUser($userid,$name)) {
                return false;
            }
            $sql = "INSERT INTO ".ThemesTable::$tableName." (".ThemesTable::$titleName.",".ThemesTable::$publicName.",".ThemesTable::$creatorName.",".ThemesTable::$themeName.") VALUES (?,?,?,?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(array($name,$public,$userid,$theme));
            $stmt->fetch(PDO::FETCH_ASSOC);
            $themeTable = $this->getLast();
            return $themeTable->id;
        }
        else {
            $sql = "UPDATE ".ThemesTable::$tableName." SET ".ThemesTable::$titleName." = ?,".ThemesTable::$publicName." = ?,".
                    ThemesTable::$creatorName." = ?,".ThemesTable::$themeName." = ? WHERE ".ThemesTable::$idName." = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(array($name,$public,$userid,$theme,$themeid));
            $stmt->fetch(PDO::FETCH_ASSOC);
            return $themeid;
            //MÓDOSÍTÁS
        }
    }
    function isThemeExistsForUser($userid,$songbook) {
        $sql = "SELECT ".ThemesTable::$titleName." FROM ".ThemesTable::$tableName." WHERE ".
                ThemesTable::$creatorName." = ? AND ".ThemesTable::$titleName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid,$songbook));
        $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();
        return ($count == 0 ? false : true);
    }
    public function getLast() {
        $sql = "SELECT * FROM ".ThemesTable::$tableName." ORDER BY ".ThemesTable::$idName." DESC LIMIT 0,1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $themeTable = new ThemesTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $themeTable;
    }
}