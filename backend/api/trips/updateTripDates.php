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
$start = $data["start_date"];
$end = $data["end_date"];

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection error"]);
  exit();
}

// Update dates for a specific trip (identified by email + city)
$stmt = $mysqli->prepare("UPDATE trips SET start_date=?, end_date=? WHERE email=? AND city_name=?");
$stmt->bind_param("ssss", $start, $end, $email, $city);
$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo json_encode(["success" => true, "message" => "Trip dates updated!"]);
} else {
  echo json_encode(["success" => false, "message" => "Trip not found or unchanged."]);
}
?>
