<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

// Get form data
$tripId = $_POST["tripId"];
$caption = $_POST["caption"];

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

// Check if the trip id from data really belongs to the user
$stmt = $mysqli->prepare("SELECT * FROM trips WHERE id=? AND email=?");
$stmt->bind_param("is", $tripId, $email);
$stmt->execute();
$result = $stmt->get_result();
$result = $result->fetch_assoc();
if (!$result) {
    echo json_encode(["success" => false, "message" => "Trip not found: id=" . $tripId]);
    exit();
}

// Add memory to database
$stmt = $mysqli->prepare("INSERT INTO memories (trip_id, caption) VALUES (?, ?)");
$stmt->bind_param("is", $tripId, $caption);
$stmt->execute();

$memId = $stmt->insert_id;

// Prepare image directory
$uploadDir = __DIR__ . "/pictures/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

foreach($_FILES["images"]["tmp_name"] as $i => $tmp) {

    // Make sure the file works
    if (!isset($_FILES["images"]) || $_FILES["images"]["error"][$i] !== UPLOAD_ERR_OK) {
        echo json_encode(["success" => false, "message" => "Invalid file upload: " . $_FILES["images"]["error"][$i]]);
        exit();
    }

    // Prepare filename
    $filename = basename($_FILES["images"]["name"][$i]);
    $uniqueName = uniqid() . "_" . $filename;
    $targetFile = $uploadDir . $uniqueName;
    
    // Move file
    if (!move_uploaded_file($_FILES["images"]["tmp_name"][$i], $targetFile)) {
        echo json_encode(["success" => false, "message" => "Upload failed: " . $_FILES["images"]["error"][$i]]);
        exit();
    }
    
    // Prepare DB
    // TODO MAKE SURE THIS SAYS BACKEND NOT OWENBACKEND !!!!
    $relativePath = "/CSE442/2025-Spring/cse-442aj/owenbackend/api/trips/pictures/" . $uniqueName;
    $stmt = $mysqli->prepare("INSERT INTO memory_images (trip_id, memory_id, image_url) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $tripId, $memId, $relativePath);
    $stmt->execute();
}

echo json_encode(["success" => true, "message" => "Memory saved"]);

?>