<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get user email from cookie
$email = $_COOKIE['user'] ?? null;

if (!$email) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit();
}

// Connect to the database
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

// Fetch all trips for the user
$stmt = $mysqli->prepare("
  SELECT id, city_name, start_date, end_date, price, image_url
  FROM trips
  WHERE email = ?
  ORDER BY created_at DESC
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$trips = [];

while ($row = $result->fetch_assoc()) {
  $start = $row['start_date'];
  $end = $row['end_date'];
  
  $formattedDates = "";
  if ($start && $end) {
    $formattedStart = date("n/j", strtotime($start));
    $formattedEnd = date("n/j", strtotime($end));
    $formattedDates = "$formattedStart - $formattedEnd";
  }

  $trips[] = [
    "id" => (int)$row["id"],
    "destination" => $row["city_name"],
    "start_date" => $start,
    "end_date" => $end,
    "dates" => $formattedDates,
    "price" => (int)$row["price"],
    "image_url" => $row["image_url"],
  ];
}

if (empty($trips)) {
  echo json_encode(["success" => false, "message" => "No trips found"]);
  exit();
}

echo json_encode(["success" => true, "trips" => $trips]);
?>
