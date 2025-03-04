<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

$jsonData = file_get_contents("php://input");

//DATA SHOULD HAVE DICTIONARY THING FROM SIGNUP PAGE
$data = json_decode($jsonData,true);

if ($data == null){
  echo json_encode(["success"=>false,"message"=>"Error with data recieved"]);
}

$email = $data['email'];
$password = $data['password'];

$hashed_p_word = password_hash($password,PASSWORD_BCRYPT);
                         //host   user  pass  DB
                         
$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");


if ($mysqli->connection_status != 0){
    echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connection_status]);
}

$stmt = $mysqli->prepare("SELECT * FROM users WHERE email=?");

$stmt->bind_param("s",$email);

$stmt->execute();

$result = $stmt->get_result();

$result = $result->fetch_assoc();

$hash = $result["password_hash"];

$good = password_verify($password,$hash);
//echo json_encode($result);

//execution found a match

if ($good){
    
    //generate uuid thing
    $uuid = uniqid(true);

    //make expiration an hour after now
    $expiration = (new DateTime())->getTimestamp() + 3600;

    //this block sets user token ID and expiration date
    $stmt = $mysqli->prepare("UPDATE users SET token=$uuid,expire=$expiration WHERE email=?");
    $stmt = bind_param("s,$email");
    $stmt->execute();

    echo json_encode(["success"=>true,"message"=>"Authentication successful","token"=>$uuid]);



} else {

    echo json_encode(["success"=>false,"message"=>"Authentication failed"]);
}


?>