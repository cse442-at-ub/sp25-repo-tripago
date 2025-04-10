<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$tripId = $_GET['tripId'] ?? null;

if (!$tripId) {
  echo json_encode(["success" => false, "message" => "Missing tripId"]);
  exit();
}

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit();
}

$stmt = $mysqli->prepare("
  SELECT td.comment, td.timestamp, u.username
  FROM trip_discussion td
  JOIN users u ON td.user_id = u.id
  WHERE td.trip_id = ?
  ORDER BY td.timestamp ASC
");
$stmt->bind_param("i", $tripId);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
  $comments[] = [
    "username" => $row["username"],
    "comment" => $row["comment"],
    "timestamp" => $row["timestamp"]
  ];
}

echo json_encode(["success" => true, "comments" => $comments]);
?>
