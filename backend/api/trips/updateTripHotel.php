<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$token = $_COOKIE['authCookie'];

$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
if ($mysqli->connect_error != 0){
    echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connect_error]);
    exit();
}

$stmt = $mysqli->prepare("SELECT * FROM users WHERE token=?");
$stmt->bind_param("s",$token);
$stmt->execute();

$result = $stmt->get_result();
$result = $result->fetch_assoc();

$email = $result["email"];
if (!$email) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
  echo json_encode(["success" => false, "message" => "Invalid input"]);
  exit();
}

$city = $data["city_name"];
$hotelName = $data["hotel_name"];
$hotelPrice = $data["hotel_price"];

// Update hotel information for a specific trip (identified by email + city)
$stmt = $mysqli->prepare("UPDATE trips SET hotel_name=?, hotel_price=? WHERE email=? AND city_name=?");
$stmt->bind_param("sdss", $hotelName, $hotelPrice, $email, $city);
$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo json_encode(["success" => true, "message" => "Trip hotel updated!"]);
} else {
  echo json_encode(["success" => false, "message" => "Trip not found or unchanged."]);
}
?> 