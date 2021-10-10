<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/2/4
 * Time: 17:24
 */

class User
{
  private $username;
  private $password;

  function __construct($username,$password) {
      $this->username = $username;//等等这里的username不应该指向private $username吗?还是就是这样指向的
      $this->password = $password;//属性写法果然不一样
  }

  function getUsername() {
      return $this->username;
  }

  function getPassword() {
      return $this->password;
  }
}
