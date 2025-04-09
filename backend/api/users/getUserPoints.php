<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
    if ($mysqli->connect_errno) {
        throw new Exception("Database connection failed: " . $mysqli->connect_error);
    }

    // Get target email from parameter
    if (!isset($_GET['email'])) {
        throw new Exception("Email parameter is required");
    }

    $targetEmail = $_GET['email'];

    // Verify the target user exists
    $stmt = $mysqli->prepare("SELECT first_name, last_name FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("s", $targetEmail);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    $userResult = $stmt->get_result();
    $userData = $userResult->fetch_assoc();

    if (!$userData) {
        throw new Exception("User not found");
    }

    // Calculate points based on number of trips
    $tripCountQuery = "SELECT COUNT(*) as trip_count FROM trips WHERE email = ?";
    $stmt = $mysqli->prepare($tripCountQuery);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("s", $targetEmail);
    $stmt->execute();
    $tripCountResult = $stmt->get_result();
    $tripCountData = $tripCountResult->fetch_assoc();
    $tripCountPoints = ($tripCountData['trip_count'] ?? 0) * 50; // 50 points per trip

    // Calculate points based on total trip days
    $tripDaysQuery = "SELECT COALESCE(SUM(DATEDIFF(end_date, start_date)), 0) as total_days 
                      FROM trips 
                      WHERE email = ?";
    $stmt = $mysqli->prepare($tripDaysQuery);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("s", $targetEmail);
    $stmt->execute();
    $tripResult = $stmt->get_result();
    $tripData = $tripResult->fetch_assoc();
    $tripPoints = ($tripData['total_days'] ?? 0) * 20; // 20 points per day

    // Calculate points based on number of expenses
    $expensesQuery = "SELECT COUNT(*) as expense_count 
                      FROM expenses e 
                      JOIN trips t ON e.trip_id = t.id 
                      WHERE t.email = ?";
    $stmt = $mysqli->prepare($expensesQuery);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("s", $targetEmail);
    $stmt->execute();
    $expenseResult = $stmt->get_result();
    $expenseData = $expenseResult->fetch_assoc();
    $expensePoints = ($expenseData['expense_count'] ?? 0) * 5; // 5 points per expense

    // Calculate points based on number of activities
    $activitiesQuery = "SELECT COUNT(*) as activity_count 
                        FROM activities a 
                        JOIN trips t ON a.trip_id = t.id 
                        WHERE t.email = ?";
    $stmt = $mysqli->prepare($activitiesQuery);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    $stmt->bind_param("s", $targetEmail);
    $stmt->execute();
    $activityResult = $stmt->get_result();
    $activityData = $activityResult->fetch_assoc();
    $activityPoints = ($activityData['activity_count'] ?? 0) * 10; // 10 points per activity

    $totalPoints = $tripCountPoints + $tripPoints + $expensePoints + $activityPoints;

    echo json_encode([
        "success" => true,
        "points" => [
            "total" => $totalPoints,
            "breakdown" => [
                "trips" => $tripCountPoints,
                "trip_days" => $tripPoints,
                "expenses" => $expensePoints,
                "activities" => $activityPoints
            ],
            "user" => [
                "email" => $targetEmail,
                "first_name" => $userData["first_name"],
                "last_name" => $userData["last_name"]
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

?> 
