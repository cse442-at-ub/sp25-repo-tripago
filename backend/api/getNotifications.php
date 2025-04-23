<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

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

$stmt = $mysqli->prepare("SELECT * FROM notifications WHERE email=? ORDER BY id DESC");
$stmt->bind_param("s", $email);
$stmt->exectue();
echo json_encode(["success" => true, "notifications" => $notifications, "email" => $email,]);
exit();
$result = $stmt->get_result();

$notifications = [];

while ($row = $result->fetch_assoc()){
    $notifications[] = ["notification_text" => $row["notification_text"]];
}


?>