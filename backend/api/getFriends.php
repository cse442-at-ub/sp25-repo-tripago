<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Verify user token
$token = $_COOKIE['authCookie'] ?? null;

if (!$token) {
    echo json_encode(["success" => false, "message" => "No auth token found"]);
    exit();
}

// Connect to database
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get email from token
$stmt = $mysqli->prepare("SELECT email FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$res = $stmt->get_result();
$user = $res->fetch_assoc();

if (!$user || !$user["email"]) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit();
}

$email = $user["email"];

// Get all approved friends (sender or recipient is this user)
$stmt = $mysqli->prepare("
    SELECT sender, recipient FROM friends
    WHERE approved = 1 AND (sender = ? OR recipient = ?)
");
$stmt->bind_param("ss", $email, $email);
$stmt->execute();
$result = $stmt->get_result();

$friendEmails = [];

while ($row = $result->fetch_assoc()) {
    if ($row["sender"] === $email) {
        $friendEmails[] = $row["recipient"];
    } else {
        $friendEmails[] = $row["sender"];
    }
}

// If there are friends, fetch their names
if (count($friendEmails) > 0) {
    $in = str_repeat('?,', count($friendEmails) - 1) . '?';
    $types = str_repeat('s', count($friendEmails));

    $stmt = $mysqli->prepare("SELECT first_name, last_name FROM users WHERE email IN ($in)");
    $stmt->bind_param($types, ...$friendEmails);
    $stmt->execute();
    $res = $stmt->get_result();

    $friendNames = [];

    while ($row = $res->fetch_assoc()) {
        $friendNames[] = $row["first_name"] . " " . $row["last_name"];
    }

    echo json_encode(["success" => true, "friends" => $friendNames]);
} else {
    echo json_encode(["success" => true, "friends" => []]);
}
?>
