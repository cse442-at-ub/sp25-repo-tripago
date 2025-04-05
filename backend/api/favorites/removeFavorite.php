<?php

$servername = "localhost";
$username = "npula";
$password = "50540565";
$dbname = "cse442_2025_spring_team_aj_db";

$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];
$countryCode = $data["countryCode"];

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

// SQL query to remove from favorites
$query = "DELETE FROM favorites WHERE email='$email' AND name='$name'";
if (mysqli_query($mysqli, $query)) {
    echo json_encode(["success" => true, "message" => "Removed from favorites"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>
