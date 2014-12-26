<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.04.
 * Time: 23:29
 */
require_once("db.php");
require_once("tablaobjektumok.php");

class EnekeskonyvSQL {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    function add($cim,$userid) {
        $sql = "INSERT INTO ".EnekeskonyvTabla::$tablaNev." (".EnekeskonyvTabla::$titleNev.",".EnekeskonyvTabla::$useridNev.") VALUES (?,?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($cim,$userid));
        $stmt->fetch(PDO::FETCH_ASSOC);
    }
    function getAllByUserid($userid) {
        $sql = "SELECT * FROM ".EnekeskonyvTabla::$tablaNev." WHERE ".EnekeskonyvTabla::$useridNev." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($userid));
        $resultArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $enekeskonyvTablaArray = array();
        foreach($resultArray as $result) {
            $tabla = new EnekeskonyvTabla($result);
            array_push($enekeskonyvTablaArray,$tabla);
        }
        return $enekeskonyvTablaArray;
    }
};