<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$email = $_COOKIE['user'] ?? null;

if (!$email) {
  echo json_encode(["success" => false, "message" => "User not logged in"]);
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

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection error"]);
  exit();
}

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