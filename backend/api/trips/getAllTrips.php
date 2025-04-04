<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get auth token from cookie
$token = $_COOKIE['authCookie'] ?? null;

if (!$token) {
  echo json_encode(["success" => false, "message" => "No auth token provided"]);
  exit();
}

// Connect to DB
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Look up user by token
$stmt = $mysqli->prepare("SELECT email FROM users WHERE token=?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !isset($user["email"])) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit();
}

$email = $user["email"];

// Fetch trips for this user
$stmt = $mysqli->prepare("
  SELECT id, city_name, start_date, end_date, image_url, travel_log, hotel_name, hotel_price
  FROM trips 
  WHERE email = ? 
  ORDER BY created_at DESC
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$trips = [];

while ($row = $result->fetch_assoc()) {
  $tripId = $row['id'];
  $start = $row['start_date'];
  $end = $row['end_date'];

  $formattedDates = "";
  if ($start && $end) {
    $formattedStart = date("n/j", strtotime($start));
    $formattedEnd = date("n/j", strtotime($end));
    $formattedDates = "$formattedStart - $formattedEnd";
  }

  // Get total expenses for this trip
  $expenseStmt = $mysqli->prepare("SELECT SUM(amount) as total_expenses FROM expenses WHERE trip_id = ?");
  $expenseStmt->bind_param("i", $tripId);
  $expenseStmt->execute();
  $expenseResult = $expenseStmt->get_result();
  $expenseData = $expenseResult->fetch_assoc();

  $totalPrice = (float)($expenseData["total_expenses"] ?? 0);

  $trips[] = [
    "id" => $tripId,
    "destination" => $row["city_name"],
    "start_date" => $start,
    "end_date" => $end,
    "dates" => $formattedDates,
    "price" => $totalPrice,
    "image_url" => $row["image_url"],
    "hotel_name" => $row["hotel_name"],
    "hotel_price" => $row["hotel_price"],
    "logged" => $row["travel_log"]
  ];
}

// Return result
if (empty($trips)) {
  echo json_encode(["success" => false, "message" => "No trips found"]);
  exit();
}

echo json_encode(["success" => true, "trips" => $trips]);
?>
