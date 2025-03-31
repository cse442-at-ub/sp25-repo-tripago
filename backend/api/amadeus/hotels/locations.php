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
$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : null;
if (!$keyword) {
    respondWithError('keyword parameter is required');
}

// Optional parameters with defaults
$countryCode = isset($_GET['countryCode']) ? $_GET['countryCode'] : null;
$pageLimit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$pageOffset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

try {
    // Initialize Amadeus API client
    $amadeus = new AmadeusAPI();
    
    // Build the search options
    $options = [
        'subType' => 'CITY,AIRPORT',
        'page[limit]' => $pageLimit,
        'page[offset]' => $pageOffset
    ];
    
    // Add country code if provided
    if ($countryCode) {
        $options['countryCode'] = $countryCode;
    }
    
    // Perform location search using the searchLocations method
    $results = $amadeus->searchLocations($keyword, $options);
    
    // Return the results
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (Exception $e) {
    $code = $e->getCode() >= 400 ? $e->getCode() : 500;
    $additionalInfo = [
        'keyword' => $keyword,
        'params' => $_GET
    ];
    
    respondWithError('Error: ' . $e->getMessage(), $code, $additionalInfo);
}
?>