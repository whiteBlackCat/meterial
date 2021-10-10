<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/3/7
 * Time: 16:46
 */
class application{
    private $act = 'index';
    private $sendcontent;

    public function __construct(){
        $this->route();
        $this->run();
    }
    public  function route(){
        if(isset($_GET['c'])){
            $this->act=$_GET['c'];
        }
    }
    public function run(){
        if(is_callable([$this,$this->act])){
            $act=$this->act;
            $this->sendcontent=$this->$act();
        }else{
            $this->sendcontent="没有找到指定控制器方法";
        }
        $this->send();
    }
    public function send(){
        ob_start();
        ob_clean();
        echo $this->sendcontent;
    }
    public function index(){
        return "初始化成功";
    }
    public function test(){
        return "test has been called";
    }
}