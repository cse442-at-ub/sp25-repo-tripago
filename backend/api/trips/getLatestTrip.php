<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$email = $_COOKIE['user'] ?? null;

if (!$email) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit();
}

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Get the most recent trip (sorted by end_date or created_at)
$stmt = $mysqli->prepare("
  SELECT * FROM trips 
  WHERE email = ? 
  ORDER BY created_at DESC 
  LIMIT 1
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$trip = $result->fetch_assoc();

if (!$trip) {
  echo json_encode(["success" => false, "message" => "No trips found"]);
  exit();
}

echo json_encode(["success" => true, "trip" => $trip]);
