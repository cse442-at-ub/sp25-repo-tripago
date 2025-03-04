<?php

if (isset($_COOKIE['authCookie']) && isset($_COOKIE['user'])){

    $email = $_COOKIE['user'];

    $mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
    if ($mysqli->connection_status != 0){
        echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connection_status]);
    }

    $stmt = $mysqli->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s",$email);
    $stmt->execute();

    $result = $stmt->get_result();
    $result = $result->fetch_assoc();

    //did not find a user with associated email
    if ($result==null){
        fail();    
    }

    $expire_time = $result['expire'];
    $current_time = (new DateTime())->getTimestamp();

    //token has expired
    if ($expire_time < $current_time){
        fail();
    } else {
        echo json_encode(["success"=>true,"message"=>"Authenticated"]);
    }



} else {
    fail();
}


function fail(){
    echo json_encode(["success"=>false,"message"=>"Authentication failed"]);    
}

?>