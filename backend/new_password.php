<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


// Database connection
$servername = "localhost"; 
$username = "root"; 
$password = ""; 
$dbname = "tripago"; 


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

// Get JSON input from React frontend
$data = json_decode(file_get_contents("php://input"), true);

//Check if all required fields are provided
if (!isset($data['password'], $data['confirmPassword'], $_GET['selector'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

//$email = $data['email'];
$new_password = $data['password'];
$confirm_password = $data['confirmPassword'];
$selector = $_GET['selector'];
print_r("Selector: ");
print_r($selector);

// Password validation
if ($new_password !== $confirm_password) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match"]);
    exit;
}

if (strlen($new_password) < 6 || !preg_match('/[A-Z]/', $new_password) || !preg_match('/[\d\W]/', $new_password)) {
    echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters long, include one uppercase letter and one number/special character"]);
    exit;
} 

$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

$sql = "UPDATE users SET password=$hashed_password WHERE reset_token=$selector LIMIT 1";
$conn->query($sql);
//print_r($sql);


// Hash the new password securely
//$selector = $conn->real_escape_string($_GET['selector']);
//$stmt = $conn->prepare($sql);

//$sql = "UPDATE users SET reset_token = ? WHERE email = ?";
//$stmt->bind_param("ss", $hashed_password, $selector); // 'ss' means two strings

//if ($stmt->execute()) {
//    echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
//} else {
//    echo json_encode(["status" => "error", "message" => "Failed to update password"]);
//}
//$stmt->close();

$conn->close();
?>
