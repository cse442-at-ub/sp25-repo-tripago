<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: OPTIONS, PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");


// Handle preflight (OPTIONS) request
//if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//    http_response_code(200);
//    exit;
//}


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//$path_to_composers_autoloader = dirname(__FILE__) . "/../path/" . $file;

//Load Composer's autoloader
require 'F:\Projects\School\sp25-repo-tripago\frontend\vendor\autoload.php';

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
$user_check_query = "SELECT email FROM user WHERE email='$email' LIMIT 1";
$user_check_result = $conn->query($user_check_query);
if ($user_check_result->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "Email not found"]);
    exit;
}

$token = bin2hex(random_bytes(16));
$token_hash = hash("sha256", $token);

// Store verification code in the database
$sql = "UPDATE user SET account_activation_hash = '$token_hash' WHERE email = '$email'";
$conn->query($sql);


// Create an instance of PHPMailer
$mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = '***@gmail.com'; // Update with your email
    $mail->Password   = '*****';         // Use an App Password (not regular password)
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('***@gmail.com', 'Tripago');
    $mail->addAddress($email);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "Password Reset Request";
    $mail->Body    = "Your verification code is: <strong>$verificationCode</strong>";

    //$mail->send();
    //echo json_encode(["status" => "success", "message" => "Password reset email sent!"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Mailer Error: {$mail->ErrorInfo}"]);
}

// Just go to the signup form for now
$resetLink = "http://localhost:5173/#/Signup";
echo json_encode(["status" => "success", "message" => "Password reset link sent!", "resetLink" => $resetLink]);


$conn->close();

?>