<?php

$servername = "localhost";
$username = "npula";
$password = "50540565";
$dbname = "cse442_2025_spring_team_aj_db";

$conn = new mysqli($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];
$countryCode = $data["countryCode"];
$email = $_COOKIE['user'];

// SQL query to remove from favorites
$query = "DELETE FROM favorites WHERE email='$email' AND name='$name'";
if (mysqli_query($conn, $query)) {
    echo json_encode(["success" => true, "message" => "Removed from favorites"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>
