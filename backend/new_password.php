<?php
session_start();

header("Access-Control-Allow-Origin: *"); // Adjust for security in production
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "tripago");

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get JSON input from React frontend
$data = json_decode(file_get_contents("php://input"), true);

// Check if all required fields are provided
if (!isset($data['password'], $data['confirmPassword'], $data['email'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$email = $data['email'];
$new_password = $data['password'];
$confirm_password = $data['confirmPassword'];

// Password validation
if ($new_password !== $confirm_password) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match"]);
    exit;
}

if (strlen($new_password) < 6 || !preg_match('/[A-Z]/', $new_password) || !preg_match('/[\d\W]/', $new_password)) {
    echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters long, include one uppercase letter and one number/special character"]);
    exit;
}

// Hash the new password securely
$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

// Update password in the database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hashed_password, $email);
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password"]);
}

$stmt->close();
$conn->close();
?>
