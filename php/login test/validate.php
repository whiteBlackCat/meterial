<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/2/4
 * Time: 17:25
 */

class Validate
{
   /*
    *  验证用户
    *  @param User $user
    */
   static function validateUser(User $user) {
       //print_r($user)
       $username = $user->getUsername();
       $password = $user->getPassword();
       unset($_SESSION['validate_username'],$_SESSION['validate_password']);

       //验证用户名
       try{
           self::validateUsername($username);
       }catch(MyException $me) {
           $_SESSION['validate_username'] = $me->getMessage();
       }

       //验证密码
       try{
           self::validatePassword($password);
       }catch(MyException $me) {
           $_SESSION['validate_password'] = $me->getMessage();
       }

       if(isset($me)) {
           throw $me;
       }
   }

   /**
    * 验证用户名
    * @param $username
    */
   static private function validateUsername($username) {
       $len = strlen($username);
       if($len <3) {
           // echo '用户名长度不能小于3位'
           //不能直输出错误信息,而是抛出异常
           throw new MyException('用户名长度不能小于3位',E_USER_ERROR);
       }
       if($len > 8) {
           throw new MyException('用户名长度不能超过8位',E_USER_ERROR);
       }
   }

   /**
    * 验证密码
    * $param $password
    */
    static private function validatePassword($password) {
        $len = strlen($password);
        if($len <3) {
            // echo '用户名长度不能小于3位'
            //不能直输出错误信息,而是抛出异常
            throw new MyException('密码长度不能小于3位',E_USER_ERROR);
        }
        if($len > 8) {
            throw new MyException('密码长度不能超过8位',E_USER_ERROR);
        }
    }
}