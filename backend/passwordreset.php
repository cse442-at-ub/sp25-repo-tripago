<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

// Database connection
$servername = "localhost"; 
$username = "root"; 
$password = ""; 
$dbname = "tripago"; 

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty($data->email)) {
    echo json_encode(["status" => "error", "message" => "Email is required"]);
    exit;
}

$email = $conn->real_escape_string($data->email);

// Check if email exists
$user_check_query = "SELECT email FROM users WHERE email='$email' LIMIT 1";
$user_check_result = $conn->query($user_check_query);
if ($user_check_result->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Email not found"]);
    exit;
}

$selector = bin2hex(random_bytes(8));
$token = bin2hex(random_bytes(16));
$token_hash = hash("sha256", $token);

$expires = date("U") + 1800;


// Store verification code in the database
$sql = "UPDATE users SET reset_token = '$token' WHERE email = '$email'";
$conn->query($sql);

$sql = "UPDATE users SET reset_token_expires = '$expires' WHERE email = '$email'";
$conn->query($sql);

$params = $_GET;
unset($params['selector']);
$params['selector'] = $token;
$url = "http://localhost:5173/#/NewPassword" .'?'.http_build_query($params);

//$url = "http://localhost:5173/#/NewPassword?selector=" . $token;

// Just go to the signup form for now
$resetLink = "$url";
echo json_encode(["status" => "success", "message" => "Password reset link sent!", "resetLink" => $url]);

$conn->close();

?>