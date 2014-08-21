<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.03.
 * Time: 17:53
 */
class EnekTabla implements JsonSerializable {

    public static $tablaNev = "enek";
    public static $idNev = "id";
    public static $cimNev = "cim";
    public static $leiroNev = "leiro";
    public static $kottaNev = "kotta";
    public static $nyelvNev = "nyelv";
    public static $masnyelvenNev = "masnyelven";
    public static $cimkekNev = "cimkek";
    public static $megjegyzesNev = "megjegyzes";

    public $tabla;
    public $id;
    public $cim;
    public $leiro;
    public $kotta;
    public $nyelv;
    public $masnyelven;
    public $cimkek;
    public $megjegyzes;

    function __construct($array) {
        $this->id = $array[EnekTabla::$idNev];
        $this->cim = $array[EnekTabla::$cimNev];
        $this->leiro = $array[EnekTabla::$leiroNev];
        $this->kotta = $array[EnekTabla::$kottaNev];
        $this->nyelv = $array[EnekTabla::$nyelvNev];
        $this->masnyelven = $array[EnekTabla::$masnyelvenNev];
        $this->cimkek = $array[EnekTabla::$cimkekNev];
        $this->megjegyzes = $array[EnekTabla::$megjegyzesNev];
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'cim' => $this->cim,
            'leiro' => $this->leiro,
            'kotta' => $this->kotta,
            'nyelv' => $this->nyelv,
            'masnyelven' => $this->masnyelven,
            'cimkek' => $this->cimkek,
            'megjegyzes' => $this->megjegyzes
        ];
    }

}

class EnekeskonyvTabla implements JsonSerializable {

    public static $tablaNev = "enekeskonyv";
    public static $idNev = "id";
    public static $useridNev = "userid";
    public static $titleNev = "title";

    public $id;
    public $userid;
    public $title;

    function __construct($array) {
        $this->id = $array[EnekeskonyvTabla::$idNev];
        $this->userid = $array[EnekeskonyvTabla::$useridNev];
        $this->title = $array[EnekeskonyvTabla::$titleNev];
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

class NyelvTabla implements JsonSerializable {

    public static $tablaNev = "nyelv";
    public static $idNev = "id";
    public static $nevNev = "nev";

    public $id;
    public $nev;

    function __construct($array) {
        $this->id = $array[NyelvTabla::$idNev];
        $this->nev = $array[NyelvTabla::$nevNev];
    }
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'nev' => $this->nev
        ];
    }
}
