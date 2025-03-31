<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once('amadeus_utils.php');

// Validate request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respondWithError('Only GET requests are allowed', 405);
}

// Required parameters
$cityCode = isset($_GET['cityCode']) ? trim($_GET['cityCode']) : null;
if (!$cityCode) {
    respondWithError('cityCode parameter is required');
}

// Optional parameters with defaults
$radius = isset($_GET['radius']) ? (int)$_GET['radius'] : 5;
$radiusUnit = isset($_GET['radiusUnit']) ? $_GET['radiusUnit'] : 'KM';
$hotelRatings = isset($_GET['ratings']) ? $_GET['ratings'] : '3,4,5';
$amenities = isset($_GET['amenities']) ? $_GET['amenities'] : 'WIFI';

try {
    // Initialize Amadeus API client
    $amadeus = new AmadeusAPI();
    
    // Search for hotels
    $searchParams = [
        'radius' => $radius,
        'radiusUnit' => $radiusUnit,
        'ratings' => $hotelRatings,
        'amenities' => $amenities
    ];
    
    $results = $amadeus->searchHotels($cityCode, $searchParams);
    
    // Return the results
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (Exception $e) {
    $code = $e->getCode() >= 400 ? $e->getCode() : 500;
    $additionalInfo = [
        'cityCode' => $cityCode,
        'params' => $_GET
    ];
    
    respondWithError('Error: ' . $e->getMessage(), $code, $additionalInfo);
}
?>