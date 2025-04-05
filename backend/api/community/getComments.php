<?php
header("Content-Type: application/json");

// Read input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["tripId"])) {
  echo json_encode(["success" => false, "message" => "Missing trip ID"]);
  exit();
}

$tripId = $data["tripId"];

// Connect to DB
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

// Fetch comments
$stmt = $mysqli->prepare("SELECT commenter_email, comment_text, created_at FROM comments WHERE trip_id = ? ORDER BY created_at ASC");
$stmt->bind_param("i", $tripId);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
  $comments[] = $row;
}

echo json_encode($comments);
?>
