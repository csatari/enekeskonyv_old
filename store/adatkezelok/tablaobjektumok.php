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

    public $tabla;
    public $id;
    public $cim;
    public $leiro;
    public $kotta;
    public $nyelv;

    function __construct($array) {
        $this->id = $array[EnekTabla::$idNev];
        $this->cim = $array[EnekTabla::$cimNev];
        $this->leiro = $array[EnekTabla::$leiroNev];
        $this->kotta = $array[EnekTabla::$kottaNev];
        $this->nyelv = $array[EnekTabla::$nyelvNev];
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'cim' => $this->cim,
            'leiro' => $this->leiro,
            'kotta' => $this->kotta,
            'nyelv' => $this->nyelv
        ];
    }

}
