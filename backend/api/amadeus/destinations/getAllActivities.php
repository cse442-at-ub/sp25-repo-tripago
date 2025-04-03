<?php
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

$trip_id = $data['trip_id'];

//get the location of trip from frontend
$start = $data['start_date'];

$token = $_COOKIE['authCookie'];

$mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
if ($mysqli->connect_errno) {
  echo json_encode(["success" => false, "message" => "Database connection failed"]);
  exit();
}

$stmt = $mysqli->prepare("SELECT * FROM users WHERE token=?");
$stmt->bind_param("s",$token);
$stmt->execute();

$result = $stmt->get_result();
$result = $result->fetch_assoc();

$email = $result["email"];
if (!$email) {
  echo json_encode(["success" => false, "message" => "Not logged in"]);
  exit();
}


checkForActivity($email,$start, $trip_id);




// function checkForActivity($email,$activity_start_date, $trip_id){
//     $mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
//     if ($mysqli->connect_error != 0){
//         echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connect_error]);
//         exit();
//     }



//     $stmt = $mysqli->prepare("SELECT * FROM activities WHERE email=? AND start_date=?");
//     $stmt->bind_param("ss",$email,$activity_start_date);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $result = $result->fetch_all();
//     $mysqli -> close();

//     //gets all rows which can be activities from the users trip
//     $all_activities = [];

//     foreach ($result as $activities){
//         //filling array with corresponding columns, and adding to list
//         $all_activities[] = ["day"=>$activities[5],"name"=>$activities[3],"price"=>$activities[6]];
//     }

//     echo json_encode(["success"=>true,"activities"=>$all_activities]);

// }
function checkForActivity($email, $trip_id) {
    $mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
    if ($mysqli->connect_error != 0){
        echo json_encode(["success" => false, "message" => "Database connection failed " . $mysqli->connect_error]);
        exit();
    }

    $stmt = $mysqli->prepare("SELECT * FROM activities WHERE email=? AND trip_id=?");
    $stmt->bind_param("si", $email, $trip_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $mysqli->close();

    $all_activities = [];

    foreach ($result as $activity){
        $all_activities[] = [
            "day" => $activity["day_number"],
            "name" => $activity["activity_name"],
            "price" => $activity["price"]
        ];
    }

    echo json_encode(["success" => true, "activities" => $all_activities]);
}



?>