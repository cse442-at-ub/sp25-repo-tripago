<?php
session_start();
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: OPTIONS, PUT, GET, POST");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
	
	
	// Database connection
	$servername = "localhost"; 
	$username = "npula"; 
	$dpassword = "50540565"; 
	$dbname = "cse442_2025_spring_team_aj_db"; 

	
	$con = new mysqli($servername, $username, $dpassword, $dbname);
	if ($con->connect_error) {
		die(json_encode(["status" => "error", "message" => "Database connection failed"]));
	}

	// Get JSON input from React frontend
	$data = json_decode(file_get_contents("php://input"), true);

	// Validate and reset password logic
	if (isset($data['key'])){
		$key = $data['key'];

		// Query to check if a user exists with the given reset_token
		$query = "SELECT * FROM users WHERE reset_token='$key' LIMIT 1";

		// Execute the query
		$result = mysqli_query($con, $query);

		// Check if the query was successful and if a row is returned
		if ($result) {
			$row = mysqli_num_rows($result);
			
			// If no rows are returned, the link is invalid
			if ($row == 0) {
				echo json_encode(["status" => "error", "message" => "invalid link"]);
				exit;
			} else {

				$password = $data['password'];
				$confirmPassword = $data['confirmPassword'];

				if ($password != $confirmPassword) {
					echo json_encode(["status" => "error", "message" => "passwords don't match"]);
					exit;
				}

				if (strlen($password) < 6 || !preg_match('/[A-Z]/', $password) || !preg_match('/[\d\W]/', $password) || !preg_match('/[\W_]/', $password)) {
    					echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters long, include one uppercase letter and one number/special character"]);
    					exit;
				}	
 
				$hashed_password = password_hash($password , PASSWORD_BCRYPT);
				
				// Update the password in the database
				if (!mysqli_query($con, "UPDATE users SET password_hash='$hashed_password' WHERE reset_token='$key'")) {
					echo json_encode(["status" => "error", "message" => "password not reset"]);
					exit;
				}

				echo json_encode(["status" => "success", "message" => "password reset"]);
				exit;
			}
		} else {
		echo json_encode(["status" => "error", "message" => "no data found"]);
		exit;
		}
	}

?>