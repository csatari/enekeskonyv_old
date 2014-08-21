<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.20.
 * Time: 16:00
 */
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tablaobjektumok.php");
class Nyelv {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    /**
     * Lekérdez egy nyelvet az ID alapján
     * @param $id
     * @return NyelvTabla
     */
    function getById($id) {
        $sql = "SELECT * FROM ".NyelvTabla::$tablaNev." WHERE ".NyelvTabla::$idNev." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($id));
        $nyelvtabla = new NyelvTabla($stmt->fetch(PDO::FETCH_ASSOC));
        return $nyelvtabla;
    }

    /**
     * Lekérdezi az összes nyelvet
     * @return NyelvTabla
     */
    function getAll() {
        $sql = "SELECT * FROM ".NyelvTabla::$tablaNev;
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $nyelvTablaArray = array();
        foreach($resultArray as $result) {
            $nyelvtabla = new NyelvTabla($result);
            array_push($nyelvTablaArray,$nyelvtabla);
        }
        return $nyelvTablaArray;
    }
}