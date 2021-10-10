<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/3/8
 * Time: 15:06
 */

class db
{
  private static $_instance;
  public $_db;

  private function __construct()
  {
      $this->_db=new PDO("mysql:host=localhost;dbname=php;charset=UTF8","root","root");

  }

  private function __clone(){

  }

  public static function getInstance(){
      if(!self::$_instance instanceof  self){
          self::$_instance = new self();
      }
      return self::$_instance;
  }
}