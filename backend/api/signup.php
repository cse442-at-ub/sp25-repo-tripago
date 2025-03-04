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

$firstName = $data['firstName'];
$lastName = $data['lastName'];
$email = $data['email'];
$password = $data['password'];
$confirmPassword = $data['confirmPassword'];


if (
  !preg_match('/[A-Z]/', $password) ||
  !preg_match('/[0-9!@#$%^&*(),.?":{}|<>]/', $password) ||
  strlen($password) < 6
) {
 //send json error and exit;
 echo json_encode(["success"=>false,"message"=>"Passwords requirements not met"]);
 exit();
} 

//hashes password from user
$hashed_p_word = password_hash($password,PASSWORD_BCRYPT);


//establish connection to sql DATABASE
$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");

//return error if there is connection issue to database
if ($mysqli->connection_status != 0){
  echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connection_status]);
}

//prepare
$stmt = $mysqli->prepare("SELECT * FROM users WHERE email=?");

//specify that firstname will go into above param
$stmt->bind_param("s",$email);

//execute the sql command
$stmt->execute();

//gets sql container object of all results
$result = $stmt->get_result();

//gets next result in object (will be null if doesn't return anything)
$result = $result->fetch_assoc();


if ($result == null){//user does not exist
  
  //prepare statement to make new user record
  $stmt = $mysqli->prepare("INSERT INTO users(first_name,last_name,email,password_hash) VALUES (?,?,?,?)");

  //enter params from frontend
  $stmt->bind_param("ssss",$firstName,$lastName,$email,$hashed_p_word);

  //add user record
  $stmt->execute();

  $response = ["success"=>true,"message"=>"User registered successfully!"];

  echo json_encode($response);

}else{

  $response = ["success"=>false,"message"=>"An error has occurred"];

  echo json_encode($response);
}



?>