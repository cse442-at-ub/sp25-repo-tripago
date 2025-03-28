<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Get email from cookie
$email = $_COOKIE['user'] ?? null;

if (!$email) {
  echo json_encode(["success" => false, "message" => "User not logged in"]);
  exit();
}

$raw = file_get_contents("php://input");
file_put_contents("debug_input.log", $raw . "\n", FILE_APPEND);
$data = json_decode($raw, true);

// Parse incoming data
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
  echo json_encode([
    "success" => false,
    "message" => "Invalid input",
    "raw" => $raw,
    "json_error" => json_last_error_msg()
  ]);
  exit();
}

$city = $data["city_name"];
$country = $data["country_name"];
$start = $data["start_date"];
$end = $data["end_date"];

// Connect to DB
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
// $mysqli = new mysqli("localhost", "tuyisabe", "50393405", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection error"]);
  exit();
}

// Get user info
$stmt = $mysqli->prepare("SELECT first_name, last_name FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
  echo json_encode(["success" => false, "message" => "User not found"]);
  exit();
}

$firstName = $user["first_name"];
$lastName = $user["last_name"];

// Save trip
$stmt = $mysqli->prepare("INSERT INTO trips (email, first_name, last_name, city_name, country_name, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $email, $firstName, $lastName, $city, $country, $start, $end);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Trip saved successfully!"]);
?>
