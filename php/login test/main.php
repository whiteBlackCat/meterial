<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/2/4
 * Time: 17:24
 */
session_start();
echo '已成功登录,用户名为: '.$_SESSION['username'];
