<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 14:18
 */
require_once("../db.php");
require_once("tablaobjektumok.php");

class EnekSQL {


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
    function add($cim,$leiro,$kotta) {
        $sql = "INSERT INTO ".EnekTabla::$tablaNev." (".EnekTabla::$cimNev.",".EnekTabla::$leiroNev.",".EnekTabla::$kottaNev.") VALUES (?,?,?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($cim,$leiro,$kotta));
        $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Lekérdez egy éneket id alapján
     * @param $id
     * @return EnekTabla
     */
    function getById($id) {
        $sql = "SELECT * FROM ".EnekTabla::$tablaNev." WHERE ".EnekTabla::$idNev." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($id));
        $enektabla = new EnekTabla($stmt->fetch(PDO::FETCH_ASSOC));
        return $enektabla;
    }

    /**
     * Lekérdez több éneket tartalmazó sort, aszerint, hogy a cím tartalmazza-e a paramétert (LIKE, nem = )
     * @param $title
     * @return array
     */
    function getByTitlePart($title) {
        $title = "%".$title."%";
        $sql = "SELECT * FROM ".EnekTabla::$tablaNev." WHERE ".EnekTabla::$cimNev." LIKE ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($title));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $enekTablaArray = array();
        foreach($resultArray as $result) {
            $enektabla = new EnekTabla($result);
            array_push($enekTablaArray,$enektabla);
        }
        return $enekTablaArray;
    }
};