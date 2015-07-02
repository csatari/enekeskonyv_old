<?php
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");


class Themes {


    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    function getAll() {
        $sql = "SELECT * FROM ".ThemesTable::$tableName;
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $tableArray = array();
        foreach($resultArray as $result) {
            $table = new ThemesTable($result);
            array_push($tableArray,$table);
        }
        return $tableArray;
    }
}