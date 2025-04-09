<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

// Define debug log path in current directory
$debugFile = __DIR__ . "/activity_debug.log";

// Helper to write to log
function debug_log($msg) {
    global $debugFile;
    file_put_contents($debugFile, "[" . date("Y-m-d H:i:s") . "] $msg\n", FILE_APPEND);
}

$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

if ($data == null) {
    debug_log("ERROR: Invalid JSON received.");
    echo json_encode(["success" => false, "message" => "Error with data received"]);
    exit();
}

$activity_day = $data['day'];
$activity_name = $data['name'];
$activity_price = $data['price'];
$activity_start_date = $data['start'];
$city_name = $data['city_name'] ?? '';

debug_log("Received - Day: $activity_day, Name: $activity_name, Price: $activity_price, Start: $activity_start_date, City: $city_name");

$token = $_COOKIE['authCookie'] ?? '';
debug_log("Auth Cookie: $token");

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
    debug_log("DB CONNECTION FAILED: " . $mysqli->connect_error);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get email from token
$stmt = $mysqli->prepare("SELECT email FROM users WHERE token=?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

$email = $result["email"] ?? null;
debug_log("Email from token: " . ($email ?? 'NULL'));

if (!$email) {
    debug_log("ERROR: Not logged in.");
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit();
}

// Get trip ID using email + start_date + city_name
$tripStmt = $mysqli->prepare("SELECT id FROM trips WHERE email = ? AND start_date = ? AND city_name = ?");
$tripStmt->bind_param("sss", $email, $activity_start_date, $city_name);
$tripStmt->execute();
$tripResult = $tripStmt->get_result()->fetch_assoc();

$trip_id = $tripResult['id'] ?? null;
debug_log("Trip ID found using email + start_date + city_name: " . ($trip_id ?? 'NULL'));

if (!$trip_id) {
    debug_log("ERROR: Trip not found.");
    echo json_encode(["success" => false, "message" => "Trip not found for given data"]);
    exit();
}

// Check if activity already exists
if (checkForActivity($trip_id, $activity_day)) {
    debug_log("DUPLICATE: Activity exists for trip $trip_id on day $activity_day.");
    echo json_encode(['success' => false, 'message' => 'You already have an activity for that day!']);
    exit();
}

// Insert activity
$insertStmt = $mysqli->prepare("INSERT INTO activities (trip_id, email, activity_name, day_number, price) VALUES (?, ?, ?, ?, ?)");
$insertStmt->bind_param("isssd", $trip_id, $email, $activity_name, $activity_day, $activity_price);
$success = $insertStmt->execute();

if ($success) {
    debug_log("SUCCESS: Activity added for trip $trip_id.");
    echo json_encode(["success" => true, 'message' => "Activity was saved successfully!"]);
} else {
    debug_log("ERROR: Insert failed. " . $insertStmt->error);
    echo json_encode(["success" => false, 'message' => "Insert failed."]);
}

// ───────────────────────────────────────────────
function checkForActivity($trip_id, $activity_day) {
    $mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
    if ($mysqli->connect_error != 0) {
        debug_log("checkForActivity: DB ERROR " . $mysqli->connect_error);
        exit();
    }

    $stmt = $mysqli->prepare("SELECT id FROM activities WHERE trip_id = ? AND day_number = ?");
    $stmt->bind_param("id", $trip_id, $activity_day);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $mysqli->close();

    return $result !== null;
}
?>
