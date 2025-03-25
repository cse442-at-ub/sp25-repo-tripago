<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

$jsonData = file_get_contents("php://input");

$data = json_decode($jsonData,true);

if ($data == null){
  echo json_encode(["success"=>false,"message"=>"Error with data recieved"]);
  exit();
}

$sender = $data['sender'];
$recipient = $data['recipient'];

$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");

if ($mysqli->connect_error != 0){
    echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connect_error]);
    exit();
}


/*
gets the specified friend request in the database, and sets the approved status to true,
to indicate that the user approved the request
*/
$stmt = $mysqli->prepare("UPDATE `friends` SET approved=1 WHERE sender=? AND recipient=?");
$stmt->bind_param("ss",$sender,$recipient);
$stmt->execute();

//errno is non zero if an error occurred
if ($stmt->errno){
    echo json_encode(["success"=>false,"message"=>"There was an error approving the request"]);
    exit();
}



?>