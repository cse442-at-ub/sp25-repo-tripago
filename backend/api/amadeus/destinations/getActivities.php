<?php

// display errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header('Content-Type: application/json');


$jsonData = file_get_contents("php://input");

$data = json_decode($jsonData,true);

if ($data == null){
  echo json_encode(["success"=>false,"message"=>"Error with data recieved"]);
  exit();
}



$lat  = $data['latitude'];
$long = $data['longitude'];



$tokenPath = __DIR__ . '/getAccessToken.php';
if (!file_exists($tokenPath)) {
    echo json_encode(['error' => 'Token file not found: ' . $tokenPath]);
    exit;
}
require_once $tokenPath;

// get access token
$token = getAccessToken();
if (!$token) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to get access token']);
    exit;
}

// make API call to Amadeus
//use lat and long from destination with a radius of 10 to find trips
$url = "https://test.api.amadeus.com/v1/shopping/activities?latitude=$lat&longitude=$long&radius=10";



$options = [
    'http' => [
        'header' => "Authorization: Bearer $token\r\n",
        'method' => 'GET',
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);


echo $response;


?>