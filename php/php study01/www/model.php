<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/3/8
 * Time: 15:25
 */
include_once "db.php";
class model
{
  protected $db;
  protected  $table;

  public function __construct()
  {
      $this->db = db::getInstance();
  }

  public function getall($field="*",$filter=[],$other=[]){
      $sql = "select $field from".$this->table.$this->where($filter).$this->other($other);
      $sth=$this->db->prepare($sql);
      if(is_array($filter)){
          $this->bindvalue($sth,$filter);
      }
      $sth->execute();
      return $sth->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getone($field="*",$filter=[]){
      $other['limit']=" limit 0,1";
      $res=$this->getall($field,$filter,$other);
      if($res){
          return $res[0];
      }else{
          return false;
      }
  }

  public function getcount($filter){
      $res=$this->getall('count(*)',$filter);
      return $res[0]['count(*)'];
  }

  public function create($data){
      $key_arr=array_keys($data);
      $var_arr=[];
      foreach($key_arr as $tmp){
          $var_arr[]=":".$tmp;
      }
      $sql=" insert into ".$this->table."(".join(",",$key_arr).") value (".join(",",$var_arr),")";
      $sth=$this->db->prepare($sql);
      $this->bindvalue($sth,$data);
  }

  public function bindvalue(&$sth,$filter){
      foreach($filter as $key => $tmp){
          $sth->bindvalue(":".$key,$tmp);
      }
  }

  private function where($filter) {
      $where=" where 1=1 ";
      if(is_string($filter)){
          $where.= " and ".$filter;
      }
      if(is_array($filter)){
          foreach($filter as $key=>$tmp){
              $where.= " and $key=;$key";
          }
      }
      return $where;
  }

  private function other($other){
    $sql ='';
    if(isset($other['group'])){
        $sql.=" ".$other['group'];
    }
    if(isset($other['order'])){
        $sql.=" ".$other['order'];
    }
    if(isset($other['limit'])){
        $sql.=" ".$other['limit'];
    }
    return $sql;
  }
}