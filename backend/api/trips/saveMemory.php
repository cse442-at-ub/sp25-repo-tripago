<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

// Get form data
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData,true);

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
$stmt->bind_param("is", $data["trip"]["id"], $email);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_assoc();
if (!$result) {
    echo json_encode(["success" => false, "message" => "Trip not found"]);
    exit();
}

// Add memory to database
$stmt = $mysqli->prepare("INSERT INTO memories (trip_id, caption) VALUES (?, ?)");
$stmt->bind_param("is", $data["trip"]["id"], $data["caption"]);
$stmt->execute();

// TODO: implement functionality to save images

echo json_encode(["success" => true, "message" => "Memory saved"]);

?>