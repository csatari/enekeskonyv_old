<?php
require_once("/tabledata/users.php");
class ErrorTable implements JsonSerializable {

    public $error;

    function __construct($error) {
        $this->error = $error;
    }
    public function jsonSerialize()
    {
        return [
            'error' => $this->error
        ];
    }
}
function checkIfValidSession($db,$sessionid) {
    $user = new Users($db);
    $lastLogin = new DateTime($user->getLatestDate($sessionid));
    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    $lastLoginTimestamp = $lastLogin->getTimestamp();
    //ha 24 óránál régebb óta lépett be, akkor nem fogadjuk el a sessiont
    if($timestamp - $lastLoginTimestamp > 24*60*60) {
        return false;
    }
    return $user->isSessionidExists($sessionid);
}