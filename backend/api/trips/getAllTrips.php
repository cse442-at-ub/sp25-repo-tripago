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

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Fetch all trips for the user
$stmt = $mysqli->prepare("
  SELECT id, city_name, start_date, end_date, image_url , hotel_name, hotel_price
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

  // Calculate total expenses for this trip from expenses table
  $expenseStmt = $mysqli->prepare("SELECT SUM(amount) as total_expenses FROM expenses WHERE trip_id = ?");
  $expenseStmt->bind_param("i", $tripId);
  $expenseStmt->execute();
  $expenseResult = $expenseStmt->get_result();
  $expenseData = $expenseResult->fetch_assoc();

  $totalPrice = (float)$expenseData["total_expenses"] ?? 0;

  $trips[] = [
    "id" => $tripId,
    "destination" => $row["city_name"],
    "start_date" => $start,
    "end_date" => $end,
    "dates" => $formattedDates,
    "price" => $totalPrice,  // Use summed expense total
    "image_url" => $row["image_url"],
    "hotel_name" => $row["hotel_name"],
    "hotel_price" => $row["hotel_price"],
  ];
}

if (empty($trips)) {
  echo json_encode(["success" => false, "message" => "No trips found"]);
  exit();
}

echo json_encode(["success" => true, "trips" => $trips]);
?>
