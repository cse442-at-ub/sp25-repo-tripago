<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Get JSON payload
$data = json_decode(file_get_contents("php://input"), true);

$tripId = $data['tripId'] ?? null;
$email = $data['email'] ?? null;

if (!$tripId || !$email) {
    echo json_encode(["success" => false, "message" => "Missing trip ID or email"]);
    exit();
}

// Connect to database
$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Make sure the user is already invited before accepting
$stmt = $mysqli->prepare("SELECT * FROM trip_collaborators WHERE trip_id = ? AND user_email = ?");
$stmt->bind_param("is", $tripId, $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No invitation found for this user"]);
    exit();
}

// Update the invite to mark it as accepted
$stmt = $mysqli->prepare("UPDATE trip_collaborators SET accepted = 1 WHERE trip_id = ? AND user_email = ?");
$stmt->bind_param("is", $tripId, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Invite accepted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to accept invitation"]);
}
?>
