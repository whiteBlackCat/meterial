<?php
/**
 * Created by PhpStorm.
 * User: Machenike
 * Date: 2018/3/8
 * Time: 16:36
 */

class page
{
    public $firstRow;//起始行数
    public $listRows;//l列表每页显示行数
    public $parameter; //分页跳转时要带的参数
    public $totalRow; //总行数
    public $totalPages; //分页总页面数
    public $rollPage = 11; //分页栏每页显示的页数
    public $lastSuffix = true;  //最后一页是否显示总页数

    private $p = 'p';//分页参数名
    private $url = '';//当前连接URL;
    private $nowPage = 1;

    //分页显示定制
    private $config = array(
        'header' => '<span class="rows">共 %TOTAL_ROW% 条记录</span>',
        'prev' => '<<',
        'next' => '>>',
        'first' => '1...',
        'last' => '...%TOTAL_PAGE%',
        'theme' => '%FIRST% %UP_PAGE% %LINK_PAGE% %END%',
    );
    /**
     * 架构函数
     * @param array $totalRows 总的记录数
     * @param array $listRows 每页显示记录数
     * @param array $patameter 分页跳转的采参数
     */
    public function __construct($totalRows, $listRows=20, $parameter = array())
    {
        $this->titalRow = $totalRows;
        $this->listRows = $listRows;
        $this->parameter  = empty($paramter) ? $_GET : $parameter;
        $this->nowPage = empty($_GET[$this->pl] ? 1:intval($_GET[$this->pl]));
        $this->nowPage = $this->nowPage ? $this->nowPage : 1;
        $this->firstRow = $this->listRows*($this->nowPage - 1);
    }

    /**
     * 定制分页链接设置
     * @param string $name 设置名称
     * @param string $value
     */
    public function setConfig($name,$value){
        if(isset($this->config[$name])){
            $this->config[name] = value;
        }
    }

    /**
     * 生成链接URL
     * @param integer $page 页码
     * @return string
     */
    private function url($page){
        return str_replace(urlencode('[PAFE]'),$page,$this->url);
    }

    /**
     * 根据当前url,获取替换格式
     */
    private function get_url(){
        $url=$_SERVER['REQUEST_URL'];
        $url=preg_replace('@'.$this->p.'=\d*@',$this->p."=".urlencode('[PAGE]'),$url,1,$count);
        if($count<1){
            if(strrpos($url,"?")){
                $url.="&".$this->p."=".urlencode('[PAGE]');
            }else{
                $url.="?".$this->p."=".urlencode('[PAGE]');
            }
        }
        return $url;
    }
    /**
     * 组件分页链接
     * @param string
     */
    public function show(){
        if(0 == $this->totalRow) return '';

        /*生成URL*/
        $this->parameter[$this->p] = '[PAGE]';
        $this->url = $this->get_url();
        /*计算分页信息*/
        $this->totalPages = ceil($this->totalRows / $this->listRows);//总页数
        if(!empty($this->totalPages) && $this->nowPage > $this->totalPages){
            $this->nowPage = $this->totalPages;
        }

        /*计算分页临时变量*/
        $now_cool_page = $this->rollPage/2;
        $now_cool_page_ceil = ceil($now_cool_page);
        if($this->lastSuffix) $this->config['last'] = $this->totalPages;

        //上一页
        $up_row = $this->nowPage - 1;
        $up_page = $up_row > 0 ? '<a class="prev" href="'.$this->url($up_row).'">'.$this->config['prev'].'</a>':
    }
}