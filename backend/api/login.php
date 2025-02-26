<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

echo "login test";

/*
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
$mysqli = new $mysqli("localhost","root","","test");

if ($mysqli->connection_status != 0){
    echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connection_status]);
}

$stmt = $mysqli->prepare("SELECT * FROM test_users WHERE email=? AND password_hash=?");

$stmt->bind_param("ss",$email,$hashed_p_word);

$stmt->execute();

$result = $stmt->get_result();

$result = $result->fetch_assoc();

//execution found a match
if ($result != null){
    echo json_encode(["success"=>true,"message"=>"Authentication successful"]);
} else {
    echo json_endcode(["success"=>false,"message"=>"Authentication failed"]);
}
*/
?>

