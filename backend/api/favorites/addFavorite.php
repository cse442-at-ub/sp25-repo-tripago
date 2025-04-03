<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$servername = "localhost";
$username = "npula";
$password = "50540565";
$dbname = "cse442_2025_spring_team_aj_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];
$countryCode = isset($data["countryCode"]) ? $data["countryCode"] : null;
$email = isset($_COOKIE["user"]) ? $_COOKIE["user"] : null;//"nobody@buffalo.edu";
//print_r("Email: '$email'");

if (!$email || !$name) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// SQL query to insert into the favorites table

$query = "INSERT INTO favorites (email, name, country_code) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "sss", $email, $name, $country_code);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["success" => true, "message" => "Added to favorites"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);