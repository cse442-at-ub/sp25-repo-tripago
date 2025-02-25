<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");


$jsonData = file_get_contents("php://input");

//DATA HAS DICTIONARY THING FROM SIGNUP PAGE
$data = json_decode($jsonData,true);


$firstName = $data['firstName'];
$lastName = $data['lastName'];
$email = $data['email'];
$password = $data['password'];
$confirmPassword = $data['confirmPassword'];

//hashes password from user
$hashed_p_word = password_hash($password,PASSWORD_BCRYPT);


//establish connection to sql DATABASE
$mysqli = new mysqli("localhost","root","","test");

//will confirm connection has been established
//echo $mysqli->host_info;

//prepare
$stmt = $mysqli->prepare("SELECT * FROM test_users WHERE email=?");

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
  $stmt = $mysqli->prepare("INSERT INTO test_users(first_name,last_name,email,password_hash) VALUES (?,?,?,?)");

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