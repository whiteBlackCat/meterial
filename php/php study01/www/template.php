<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/3/8
 * Time: 16:05
 */

class template
{
    private $params=[];
    public function assign($key,$val){
      $this->params[$key]=$val;
    }
    public function fetch($temp){
        extract($this->params);
        ob_start();
        ob_clean();
        include($temp);
        $content=ob_get_contents();
        ob_end_clean();
        return $content;
    }
}