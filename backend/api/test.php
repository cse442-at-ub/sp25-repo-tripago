<?php
// CORS configuration
header("Access-Control-Allow-Origin: *"); // Allow all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If it's a preflight request (a preliminary HTTP request sent by a browser to a server before making the actual request), return an empty response
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Allows JSON
header("Content-Type: application/json");
echo json_encode(["message" => "Hello from PHP."]);
?>

