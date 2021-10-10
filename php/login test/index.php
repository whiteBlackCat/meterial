<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/2/4
 * Time: 17:23
 */
session_start();
$validate_username = isset($_SESSION['validate_username']) ? $_SESSION['validate_username'] : '';
$validate_password = isset($_SESSION['validate_password']) ? $_SESSION['validate_password'] : '';
?>
<html>
<head>
    <meta charset="utf-8">
    <title>用户登录</title>
</head>
<body>
<h1>用户登录</h1>
<form action="login.php" method="post">
    用户名:<input type="text" name="username" value=""><font color="red"><?php
        echo $validate_username; ?></font><br><br>
    密码:<input type="password" name="password" value=""><font color="red"><?php
        echo $validate_password; ?></font><br><br>
    <input type="submit" value="提交">
</form>
</body>
</html>