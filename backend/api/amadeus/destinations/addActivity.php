<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

// Parse request body
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
  echo json_encode(["success" => false, "message" => "Error with data received"]);
  exit();
}

// Required fields
$activity_day = $data['day'];
$activity_name = $data['name'];
$activity_price = $data['price'];
$activity_start_date = $data['start'];  // not currently used
$trip_id = $data['trip_id'];

// Get auth token
$token = $_COOKIE['authCookie'] ?? null;
if (!$token) {
  echo json_encode(["success" => false, "message" => "No authentication token"]);
  exit();
}

// DB connection
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Get user by token
$stmt = $mysqli->prepare("SELECT email FROM users WHERE token=?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$email = $user['email'] ?? null;
if (!$email) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit();
}

// Check for existing activity on that day
if (checkForActivity($mysqli, $email, $trip_id, $activity_day)) {
  echo json_encode(["success" => false, "message" => "You already have an activity for that day!"]);
  exit();
}

// Insert new activity
$stmt = $mysqli->prepare("INSERT INTO activities (email, activity_name, day_number, price, trip_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssidi", $email, $activity_name, $activity_day, $activity_price, $trip_id);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Activity was saved successfully!"]);
exit();

// ------------------ Helper ------------------ //
function checkForActivity($mysqli, $email, $trip_id, $activity_day) {
  $stmt = $mysqli->prepare("SELECT id FROM activities WHERE email=? AND trip_id=? AND day_number=?");
  $stmt->bind_param("sii", $email, $trip_id, $activity_day);
  $stmt->execute();
  $result = $stmt->get_result()->fetch_assoc();
  return $result !== null;
}
?>
