<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Authenticate & get email
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

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

if (!$email || !$data || !isset($data["destination"])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
exit();
}

// Get trip ID
$city = $data["destination"];
$stmt = $mysqli->prepare("SELECT id FROM trips WHERE email=? AND city_name=?");
$stmt->bind_param("ss", $email, $city);
$stmt->execute();
$result = $stmt->get_result();
$trip = $result->fetch_assoc();
if (!$trip) {
  echo json_encode(["success" => false, "message" => "Trip not found"]);
  exit();
}
$tripId = $trip["id"];

// Set travel_log in database
$stmt = $mysqli->prepare("UPDATE trips SET travel_log = ? WHERE id = ?");
$stmt->bind_param("ii", 1, $tripId);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Successfully posted to travel log."]);

?>