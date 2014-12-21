<?php
header('Content-Type: text/html; charset=utf-8');
class EnekPont implements JsonSerializable {
    private $cim;
    private $id;
    public function __construct($id,$cim) {
        $this->id = $id;
        $this->cim = $cim;
    }
    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'cim' => $this->cim
        ];
    }
};

$enek1 = new EnekPont(1,"Egy cím");
$enek2 = new EnekPont(2,"Második cím");
$enek3 = new EnekPont(3,"Harmadik cím");
$enek4 = new EnekPont(4,"Negyedik cím");
$enek5 = new EnekPont(5,"Ötödik cím");
$array = [ $enek1, $enek2, $enek3, $enek4, $enek5];
echo json_encode($array);