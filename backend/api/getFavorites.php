<?php

$servername = "localhost";
$username = "npula";
$password = "50540565";
$dbname = "cse442_2025_spring_team_aj_db";

$conn = new mysqli($servername, $username, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);
//$name = $data["name"];
//$countryCode = $data["countryCode"];
if (!isset($data["email"])) {
	$email = isset($_COOKIE['user']) ? $_COOKIE['user'] : null;
} else {
	$email = $data["email"];
}
// SQL query to insert into the favorites table
//$query = "INSERT INTO favorites (name, country_code) VALUES ('$name', '$countryCode')";
// Prepare query
$query = "SELECT location, city_code FROM favorites WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Fetch locations
//$locations = [];
//while ($row = $result->fetch_assoc()) {
//    $locations[] = $row['location'];
//}

if ($result) {
    $locations = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $locations[] = [
            "location" => $row["location"],         // or $row["name"] if that's the actual column
            "cityCode" => $row["city_code"] // make sure this column exists in your query
        ];
    }
    echo json_encode(["success" => true, "locations" => $locations]);
} else {
    echo json_encode(["success" => false, "error" => "DB error"]);
}