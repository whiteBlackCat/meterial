<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/2/4
 * Time: 17:23
 */
session_start();

echo $_POST;
$username = $_POST['username'];
$password = $_POST['password'];

//echo $username,'=>',$password

$user = new User($username,$password);

//判断是否登录成功
try{
    Validate::validateUser($user);
    //验证通过,登录成功
    $_SESSION['username'] = $username;
    header('Location:main.php');
}catch (MyException $me) {
    //登录失败
    header('Location:index.php');
}

/**
 * 自动加载类函数
 * @param $class
 * @return string
 */
function __autoload($class) {
    $file = __DIR__.'/'.strtolower($class).'.php';
    if(is_file($file)) {
        include_once $file;
    }
    return '';
}