<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.20.
 * Time: 16:00
 */
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");

class Language {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    /**
     * Lekérdez egy nyelvet az ID alapján
     * @param $id
     * @return LanguageTable
     */
    function getById($id) {
        $sql = "SELECT * FROM ".LanguageTable::$tableName." WHERE ".LanguageTable::$idName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($id));
        $languageTable = new LanguageTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $languageTable;
    }

    /**
     * Lekérdez egy nyelvet a neve alapján
     * @param $name
     * @return LanguageTable
     */
    function getByName($name) {
        $sql = "SELECT * FROM ".LanguageTable::$tableName." WHERE ".LanguageTable::$nameName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($name));
        $languageTable = new LanguageTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $languageTable;
    }

    /**
     * Lekérdezi az összes nyelvet
     * @return LanguageTable
     */
    function getAll() {
        $sql = "SELECT * FROM ".LanguageTable::$tableName;
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $languageTableArray = array();
        foreach($resultArray as $result) {
            $languageTable = new LanguageTable($result);
            array_push($languageTableArray,$languageTable);
        }
        return $languageTableArray;
    }
}