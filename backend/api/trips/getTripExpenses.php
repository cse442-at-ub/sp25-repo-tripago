<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$token = $_COOKIE['authCookie'];

$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
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

$city = $_GET['city_name'] ?? null;

if (!$email || !$city) {
  echo json_encode(["success" => false, "message" => "Missing data"]);
  exit();
}

$tripStmt = $mysqli->prepare("SELECT id FROM trips WHERE email=? AND city_name=?");
$tripStmt->bind_param("ss", $email, $city);
$tripStmt->execute();
$tripResult = $tripStmt->get_result();
$trip = $tripResult->fetch_assoc();

if (!$trip) {
  echo json_encode(["success" => false, "message" => "Trip not found"]);
  exit();
}

$tripId = $trip["id"];

$expStmt = $mysqli->prepare("SELECT category, amount FROM expenses WHERE trip_id=?");
$expStmt->bind_param("i", $tripId);
$expStmt->execute();
$expResult = $expStmt->get_result();

$expenses = [];
while ($row = $expResult->fetch_assoc()) {
  $expenses[] = $row;
}

echo json_encode(["success" => true, "expenses" => $expenses]);
?>

