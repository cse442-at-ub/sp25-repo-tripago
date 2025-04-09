<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

// Get form data
$jsonData = file_get_contents("php://input");
$trip = json_decode($jsonData,true);

// Get email from auth token
$token = $_COOKIE['authCookie'];
$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
$stmt = $mysqli->prepare("SELECT * FROM users WHERE token=?");
$stmt->bind_param("s",$token);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_assoc();
$email = $result["email"];
if (!$email) {
    echo json_encode(["success" => false, "message" => "User not authenticated"]);
    exit();
}

// Check if the trip id from data really belongs to the user
$stmt = $mysqli->prepare("SELECT * FROM trips WHERE id=? AND email=?");
$stmt->bind_param("is", $trip["id"], $email);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_assoc();
if (!$result) {
    echo json_encode(["success" => false, "message" => "Trip not found"]);
    exit();
}

// Fetch memories
$stmt = $mysqli->prepare("SELECT * FROM memories WHERE trip_id=? ORDER BY created_at DESC");
$stmt->bind_param("i", $trip["id"]);
$stmt->execute();
$result = $stmt->get_result();

$memories = [];

while ($row = $result->fetch_assoc()) {
    $id = $row["id"];
    $caption = $row["caption"];

    $memories[] = [
        "id" => $id,
        "caption" => $caption,
    ];
}

// Return result
if (empty($memories)) {
    echo json_encode(["success" => false, "message" => "No memories found"]);
    exit();
}

echo json_encode(["success" => true, "memories" => $memories]);
?>