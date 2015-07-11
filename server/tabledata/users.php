<?php
$ROOT = dirname(__FILE__)."\\";
require_once($ROOT."..\\db.php");
require_once("tableobjects.php");
//TODO ki kell törölni a sessionid-t 12 óra után, vagy akkor már ne legyen érvényes
class Users {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    /**
     * Lekérdez egy felhasználót az ID alapján
     * @param $id
     * @return UsersTable
     */
    function getById($id) {
        $sql = "SELECT * FROM ".UsersTable::$tableName." WHERE ".UsersTable::$idName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($id));
        $usertabla = new UsersTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $usertabla;
    }

    function getByUsername($username) {
        $sql = "SELECT * FROM ".UsersTable::$tableName." WHERE ".UsersTable::$usernameName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($username));
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$result) {
            return null;
        }
        $usertabla = new UsersTable($result);
        return $usertabla;
    }
    function getBySession($sessionid) {
        $sql = "SELECT * FROM ".UsersTable::$tableName." WHERE ".UsersTable::$sessionName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($sessionid));
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$result) {
            return null;
        }
        $usertabla = new UsersTable($result);
        return $usertabla;
    }
    function getLatestDate($sessionid) {
        $usertable = $this->getBySession($sessionid);
        return $usertable->date;

    }
    // Megmondja, hogy a $id id-jű felhasználó jelszava megegyezik-e a $password-del
    function isPasswordSame($usertable,$password) {
        if($usertable->pass == $password) {
            return true;
        }
        else return false;
    }

    /**
     * Hozzáad egy felhasználót az adatbázishoz
     * @param $firstname,$lastname,$username,$email,$pass
     * TODO hibaellenőrzés
     */
    function add($firstname,$lastname,$username,$email,$pass) {
        if(!$this->isEmailValid($email)) {
            return false;
        }
        $sql = "INSERT INTO ".UsersTable::$tableName." (".UsersTable::$firstnameName.",".UsersTable::$lastnameName.",".
            UsersTable::$usernameName.",".UsersTable::$emailName.",".UsersTable::$passName.") VALUES (?,?,?,?,?)";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute(array($firstname,$lastname,$username,$email,$pass));
        return $result;
    }

    public function getLastUser() {
        $sql = "SELECT * FROM ".UsersTable::$tableName." ORDER BY ".UsersTable::$idName." DESC LIMIT 0,1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $usertabla = new UsersTable($stmt->fetch(PDO::FETCH_ASSOC));
        return $usertabla;
    }

    // frissíti az id felhasználó utolsó bejelentkezési idejét timestamp-re
    function updateDate($id,$timestamp) {
        $sql = "UPDATE ".UsersTable::$tableName." SET ".UsersTable::$dateName."= ? WHERE ".UsersTable::$idName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array(date("Y-m-d H:i:s",$timestamp),$id));
    }

    // frissíti az id felhasználó sessionid-jét
    function updateSessionid($id,$sessionid) {
        $sql = "UPDATE ".UsersTable::$tableName." SET ".UsersTable::$sessionName."= ? WHERE ".UsersTable::$idName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($sessionid,$id));
    }

    //bejelentkezteti a megadott felhasználót, azaz visszaad egy sessionid-t, és a sessionid és a date-t beírja a táblába
    function login($usertable) {
        $date = new DateTime();
        $timestamp = $date->getTimestamp();
        $lastLogin = new DateTime($usertable->date);
        $lastLoginTimestamp = $lastLogin->getTimestamp();
        //ha 12 óra, vagy kevesebb óta lépett be, akkor nem számolunk új sessionid-t
        if($timestamp - $lastLoginTimestamp < 12*60*60 && $usertable->session != "") {
            return $usertable->session;
        }

        $sessionid = hash ( "sha256", $usertable->email."session".$timestamp);
        $this->updateDate($usertable->id, $timestamp);
        $this->updateSessionid($usertable->id,$sessionid);
        return $sessionid;
    }
    // beállítja a usernek a megadott témát
    function updateTheme($id,$theme) {
        $sql = "UPDATE ".UsersTable::$tableName." SET ".UsersTable::$themeName."= ? WHERE ".UsersTable::$idName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($theme,$id));
    }

    function isUsernameExists($username) {
        $sql = "SELECT ".UsersTable::$usernameName." FROM ".UsersTable::$tableName." WHERE ".UsersTable::$usernameName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($username));
        $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();
        return ($count == 0 ? false : true);
    }
    function isEmailValid($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        return true;
    }
    function isSessionidExists($sessionid) {
        $sql = "SELECT ".UsersTable::$usernameName." FROM ".UsersTable::$tableName." WHERE ".UsersTable::$sessionName." = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array($sessionid));
        $stmt->fetch(PDO::FETCH_ASSOC);
        $count = $stmt->rowCount();
        return ($count == 0 ? false : true);
    }
    function deleteSession($sessionid) {
        $username = $this->getBySession($sessionid);
        $this->updateSessionid($username->id,"");
    }
}