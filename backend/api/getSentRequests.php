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

//set sender as user who sent the request
$sender = $_COOKIE['user'];;

$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");

if ($mysqli->connect_error != 0){
    echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connect_error]);
    exit();
}

//Get all emails that user is sending requests to. This will get pending requests
$stmt = $mysqli->prepare("SELECT (recipient) FROM friends WHERE sender=? AND approved=0");
$stmt->bind_param("s",$sender);
$stmt->execute();

$result = $stmt->get_result();
$result = $result->fetch_all();
$pending_requests;
//populate pending requests with emails pending requests are sent to
foreach ($result as $email){
    $pending_requests[] = $email[0];
}

//do the same but for accepted requests
$stmt = $mysqli->prepare("SELECT (recipient) FROM friends WHERE sender=? AND approved=1");
$stmt->bind_param("s",$sender);
$stmt->execute();

$result = $stmt->get_result();
$result = $result->fetch_all();
$approved_requests;
//populate pending requests with emails pending requests are sent to
foreach ($result as $email){
    $approved_requests[] = $email[0];
}

//at this point, we should have two lists, each containing email strings. One has approved emails, and the other pending
$in = str_repeat('?,',count($pending_requests)-1). '?';
//get first and last names of emails from users table
$stmt = $mysqli->prepare("SELECT first_name,last_name FROM users WHERE email IN ($in)");
$types = str_repeat('s',count($pending_requests));
$stmt->bind_param($types,...$pending_requests);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_all();

//$result should have list of lists
//this should get a list of first names and last names from the users table
$pending_names;
foreach ($result as $names){
    $full_name = $names[0] . ' ' . $names[1];
    $pending_names[] = $full_name;
}
//here, $pending_names has list of names which are pending 

//now get approved names 
$in = str_repeat('?,',count($approved_requests)-1). '?';
$stmt = $mysqli->prepare("SELECT first_name,last_name FROM users WHERE email IN ($in)");
$types = str_repeat('s',count($approved_requests));
$stmt->bind_param($types,...$approved_requests);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_all();
$approved_names;
foreach ($result as $names){
    $full_name = $names[0] . ' ' . $names[1];
    $approved_names[] = $full_name;
}

//here $appoved_names and $pending_names should have corresponding data

//send list of approved names and pending names. List of two lists
echo json_encode([$appoved_names,$pending_names]);

?>