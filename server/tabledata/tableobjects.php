<?php

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
class SongTable implements JsonSerializable {

    public static $tableName = "song";
    public static $idName = "id";
    public static $versionName = "version";
    public static $creatorName = "creator";
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
    public $creator;
    public $title;
    public $text;
    public $notes;
    public $language;
    public $otherlang;
    public $labels;
    public $comment;
    public $permissions; //plusz információ, hogy milyen műveletek megengedettek egy usernek

    function __construct($array) {
        $this->id = $array[SongTable::$idName];
        $this->version = $array[SongTable::$versionName];
        $this->creator = $array[SongTable::$creatorName];
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
            'creator' => $this->creator,
            'title' => $this->title,
            'song' => $this->text,
            'sheet_music' => $this->notes,
            'language' => $this->language,
            'other_languages' => $this->otherlang,
            'labels' => $this->labels,
            'comment' => $this->comment,
            'permissions' => $this->permissions
        ];
    }

}
class SongbookTable implements JsonSerializable {

    public static $tableName = "songbook";
    public static $idName = "id";
    public static $useridName = "userid";
    public static $titleName = "title";
    public static $publicName = "public";

    public $id;
    public $userid;
    public $title;
    public $public;
    public $username; //csak az adminoknak kell plusz információnak
    public $permissions; //csak plusz információ, hogy milyen jog megengedett az adott usernek
    public $permissionlevel; // csak plusz információ, ki tudja deríteni belőle a kliens a jog nevét
    public $songnumber; //csak plusz információ a gyorsabb betöltés érdekében

    function __construct($array) {
        $this->id = $array[SongbookTable::$idName];
        $this->userid = $array[SongbookTable::$useridName];
        $this->title = $array[SongbookTable::$titleName];
        $this->public = $array[SongbookTable::$publicName];
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'userid' => $this->userid,
            'title' => $this->title,
            'public' => $this->public,
            'username' => $this->username,
            'permissions' => $this->permissions,
            'permissionlevel' => $this->permissionlevel,
            'songnumber' => $this->songnumber
        ];
    }
}
class SongbookSharedTable implements JsonSerializable {

    public static $tableName = "`songbook-shared`";
    public static $useridName = "userid";
    public static $songbookidName = "songbookid";

    public $userid;
    public $songbookid;

    function __construct($array) {
        $this->userid = $array[SongbookSharedTable::$useridName];
        $this->songbookid = $array[SongbookSharedTable::$songbookidName];
    }

    public function jsonSerialize()
    {
        return [
            'userid' => $this->userid,
            'songbookid' => $this->songbookid
        ];
    }
}

class SongInSongbookTable implements JsonSerializable {

    public static $tableName = "song_in_songbook";
    public static $songbookIdName = "songbook";
    public static $songIdName = "song";

    public $songbook;
    public $song;

    function __construct($array) {
        $this->songbook = $array[SongInSongbookTable::$songbookIdName];
        $this->song = $array[SongInSongbookTable::$songIdName];
    }

    public function jsonSerialize()
    {
        return [
            'songbook' => $this->songbook,
            'song' => $this->song
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
        $this->id = $array[ThemesTable::$idName];
        $this->title = $array[ThemesTable::$titleName];
        $this->public = $array[ThemesTable::$publicName];
        $this->creator = $array[ThemesTable::$creatorName];
        $this->theme = $array[ThemesTable::$themeName];
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
    public static $themeName = "chosentheme";
    public static $adminName = "admin";

    public $id;
    public $session;
    public $lastname;
    public $firstname;
    public $username;
    public $email;
    public $pass;
    public $date;
    public $theme;
    public $admin;

    function __construct($array) {
        $this->id = $array[UsersTable::$idName];
        $this->session = $array[UsersTable::$sessionName];
        $this->lastname = $array[UsersTable::$lastnameName];
        $this->firstname = $array[UsersTable::$firstnameName];
        $this->username = $array[UsersTable::$usernameName];
        $this->email = $array[UsersTable::$emailName];
        $this->pass = $array[UsersTable::$passName];
        $this->date = $array[UsersTable::$dateName];
        $this->theme = $array[UsersTable::$themeName];
        $this->admin = $array[UsersTable::$adminName];
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
            'date' => $this->date,
            'chosentheme' => $this->theme,
            'admin' => $this->admin
        ];
    }
}