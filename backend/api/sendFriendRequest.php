<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

$jsonData = file_get_contents("php://input");

//data will have 'dictionary' object from friend page
$data = json_decode($jsonData,true);


//fail if data is null
if ($data == null){
  echo json_encode(["success"=>false,"message"=>"Error with data recieved"]);
  exit();
}

$sender = $_COOKIE['user'];
$recipient = $data['searchTerm'];

$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");


if ($mysqli->connect_error != 0){
    echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connect_error]);
    exit();
}


$stmt = $mysqli->prepare("SELECT * FROM users WHERE email=? ");
$stmt->bind_param("s",$recipient);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_assoc();
//checks if recipient of request exists in user table
if ($result == null){
  echo json_encode(["success"=>false,"message"=>"User does not exist"]);
  exit();
}

$stmt = $mysqli->prepare("SELECT * FROM friends WHERE sender=? AND recipient=?");
$stmt->bind_param("ss",$sender,$recipient);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_assoc();
//fail if the query finds a request going to the recipient already 
if ($result != NULL){
    echo json_encode(["success"=>false,"message"=>"There is already an outgoing request to this user"]);
    exit();
}

/*
At this point, can send the request by making a new row in table

makes a new entry in the friends table, specifing who sent the request,
and who recieved it. The request must be approved, so the associated approved value defaults to false
*/

$stmt = $mysqli->prepare("INSERT INTO friends (sender,recipient) VALUES (?,?)");
$stmt->bind_param("ss",$sender,$recipient);
$stmt->execute();

echo json_encode(["success"=>true,"message"=>"request sent!"]);

?>