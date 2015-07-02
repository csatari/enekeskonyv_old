<?php
class SongTable implements JsonSerializable {

    public static $tableName = "song";
    public static $idName = "id";
    public static $versionName = "version";
    public static $titleName = "title";
    public static $textName = "song";
    public static $notesName = "sheet_music";
    public static $langName = "language";
    public static $otherlangName = "other_languages";
    public static $labelsName = "labels";
    public static $commentName = "comment";

    public $tabla;
    public $id;
    public $version;
    public $title;
    public $text;
    public $notes;
    public $language;
    public $otherlang;
    public $labels;
    public $comment;

    function __construct($array) {
        $this->id = $array[SongTable::$idName];
        $this->version = $array[SongTable::$versionName];
        $this->title = $array[SongTable::$titleName];
        $this->text = $array[SongTable::$textName];
        $this->notes = $array[SongTable::$notesName];
        $this->language = $array[SongTable::$langName];
        $this->otherlang = $array[SongTable::$otherlangName];
        $this->labels = $array[SongTable::$labelsName];
        $this->comment = $array[SongTable::$commentName];
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'version' => $this->version,
            'title' => $this->title,
            'song' => $this->text,
            'sheet_music' => $this->notes,
            'language' => $this->language,
            'other_languages' => $this->otherlang,
            'labels' => $this->labels,
            'comment' => $this->comment
        ];
    }

}

class SongbookTable implements JsonSerializable {

    public static $tableName = "songbook";
    public static $idName = "id";
    public static $useridName = "userid";
    public static $titleName = "title";

    public $id;
    public $userid;
    public $title;

    function __construct($array) {
        $this->id = $array[SongbookTable::$idName];
        $this->userid = $array[SongbookTable::$useridName];
        $this->title = $array[SongbookTable::$titleName];
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'userid' => $this->userid,
            'title' => $this->title
        ];
    }
}

class LanguageTable implements JsonSerializable {

    public static $tableName = "language";
    public static $idName = "id";
    public static $nameName = "name";

    public $id;
    public $name;

    function __construct($array) {
        $this->id = $array[LanguageTable::$idName];
        $this->name = $array[LanguageTable::$nameName];
    }
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }
}

class UsersTable implements JsonSerializable {

    public static $tableName = "users";
    public static $idName = "id";
	public static $sessionName = "session";
	public static $lastnameName = "lastname";
    public static $firstnameName = "firstname";
	public static $usernameName = "username";
	public static $emailName = "email";
	public static $passName = "pass";
	public static $dateName = "date";

    public $id;
    public $session;
    public $lastname;
    public $firstname;
    public $username;
    public $email;
    public $pass;
    public $date;

    function __construct($array) {
        $this->id = $array[UsersTable::$idName];
        $this->session = $array[UsersTable::$sessionName];
        $this->lastname = $array[UsersTable::$lastnameName];
        $this->firstname = $array[UsersTable::$firstnameName];
        $this->username = $array[UsersTable::$usernameName];
        $this->email = $array[UsersTable::$emailName];
        $this->pass = $array[UsersTable::$passName];
        $this->date = $array[UsersTable::$dateName];
    }
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'session' => $this->session,
            'lastname' => $this->lastname,
            'firstname' => $this->firstname,
            'username' => $this->username,
            'email' => $this->email,
            'pass' => $this->pass,
            'date' => $this->date

        ];
    }
}

class ThemesTable implements JsonSerializable {

    public static $tableName = "themes";
    public static $idName = "id";
    public static $titleName = "title";
    public static $publicName = "public";
    public static $creatorName = "creator";
    public static $themeName = "theme";

    public $id;
    public $title;
    public $public;
    public $creator;
    public $theme;

    function __construct($array) {
        $this->id = $array[LanguageTable::$idName];
        $this->title = $array[LanguageTable::$titleName];
        $this->public = $array[LanguageTable::$publicName];
        $this->creator = $array[LanguageTable::$creatorName];
        $this->theme = $array[LanguageTable::$themeName];
    }
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'public' => $this->public,
            'creator' => $this->creator,
            'theme' => $this->theme,
        ];
    }
}