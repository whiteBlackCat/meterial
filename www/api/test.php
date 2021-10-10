<?php

    $name = $_GET['name'];
    $age =  $_POST['age'];
    $db =  $_POST['db'];

    $response_obj->name =  $name;
    $response_obj->age = $age;
    $response_obj->sb = $db;


    echo json_encode($response_obj);
?>