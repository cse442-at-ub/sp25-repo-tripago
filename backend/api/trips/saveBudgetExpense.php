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

if (!$email || !$data || !isset($data["city_name"])) {
  echo json_encode(["success" => false, "message" => "Invalid input"]);
  exit();
}

$city = $data["city_name"];

// Get trip ID
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

if (isset($data["category"]) && isset($data["amount"])) {
  // Save new EXPENSE
  $category = $data["category"];
  $amount = floatval($data["amount"]);

  $insertStmt = $mysqli->prepare("INSERT INTO expenses (trip_id, category, amount) VALUES (?, ?, ?)");
  $insertStmt->bind_param("isd", $tripId, $category, $amount);
  $insertStmt->execute();

  echo json_encode(["success" => true, "message" => "Expense saved"]);
} else if (isset($data["budget_amount"])) {
  // Save new BUDGET
  $budgetAmount = floatval($data["budget_amount"]);

  $updateStmt = $mysqli->prepare("UPDATE trips SET budget_amount = ? WHERE id = ?");
  $updateStmt->bind_param("di", $budgetAmount, $tripId);
  $updateStmt->execute();

  echo json_encode(["success" => true, "message" => "Budget amount updated"]);
} else {
  echo json_encode(["success" => false, "message" => "Missing expense or budget data"]);
}
?>
