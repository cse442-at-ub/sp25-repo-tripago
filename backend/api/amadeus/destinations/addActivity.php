<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS");
header("Content-Type: application/json");

$jsonData = file_get_contents("php://input");

//DATA SHOULD HAVE DICTIONARY THING FROM SIGNUP PAGE
$data = json_decode($jsonData,true);

if ($data == null){
  echo json_encode(["success"=>false,"message"=>"Error with data recieved"]);
  exit();
}
/*
day - the day that the activity falls on
name - the name of the activity
price - the price of the activity
start date - the start date of the TRIP (used for safety)
user - gets the email of the user who is making the request
*/
$activity_day = $data['day'];
$activity_name = $data['name'];
$activity_price = $data['price'];
$activity_start_date = $data['start'];
$trip_id = $data['trip_id'];
$email = $_COOKIE['user'];


if (checkForActivity($email,$trip_id, $activity_start_date,$activity_day)){
    //there is already an activity on that day for that trip
    echo json_encode(['success'=>false, 'message'=>'You already have an activity for that day!']);
    exit();
}

//can add the activity at this point

$mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
if ($mysqli->connect_error != 0){
    echo json_encode(["success" => false, "message" => "Database connection failed " . $mysqli->connect_error]);
    exit();
}

$stmt = $mysqli->prepare("INSERT INTO activities (email, activity_name, day_number, price, trip_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssidi", $email, $activity_name, $activity_day, $activity_price, $trip_id);
$stmt->execute();

echo json_encode(["success" => true, 'message' => "Activity was saved successfully!"]);



/*
checks if user already has an activity for the trip on a particular day
*/
// function checkForActivity($email,$trip_id,$activity_start_date,$activity_day){
//     $mysqli = new mysqli("localhost","romanswi","50456839","cse442_2025_spring_team_aj_db");
//     if ($mysqli->connect_error != 0){
//         echo json_encode(["success"=>false,"message"=>"Database connection failed ". $mysqli->connect_error]);
//         exit();
//     }



//     $stmt = $mysqli->prepare("SELECT * FROM activities WHERE email=? AND start_date=? AND day_number=?");
//     $stmt->bind_param("ssd",$email,$activity_start_date,$activity_day);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $result = $result->fetch_assoc();

//     $mysqli -> close();

//     if ($result == null){
//         //there are no activites for that day of trip 
//         return false;
//     } else {
//         //it found a activity for the day
//         return true;
//     }


// }

function checkForActivity($email, $trip_id, $activity_day) {
    $mysqli = new mysqli("localhost", "romanswi", "50456839", "cse442_2025_spring_team_aj_db");
    if ($mysqli->connect_error != 0){
        echo json_encode(["success" => false, "message" => "Database connection failed " . $mysqli->connect_error]);
        exit();
    }

    $stmt = $mysqli->prepare("SELECT * FROM activities WHERE email=? AND trip_id=? AND day_number=?");
    $stmt->bind_param("sii", $email, $trip_id, $activity_day);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    $mysqli->close();

    return $result !== null;
}



?>