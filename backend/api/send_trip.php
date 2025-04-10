
<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: OPTIONS, PUT, GET, POST");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	//use PHPMailer\PHPMailer\Exception;

	include dirname(__DIR__) .'/PHPMailer.php';
  	include dirname(__DIR__) .'/SMTP.php';
  	//include dirname(__DIR__) .'/Exception.php';

	//$path_to_composers_autoloader = dirname(__FILE__) . "/frontend/vendor/" . "autoload.php";
	//Load Composer's autoloader
	//require '..\..\npula\frontend\vendor\autoload.php';
	//require $_SERVER['DOCUMENT_ROOT'] . '../../npula/frontend/vendor/autoload.php';
	require "vendor/autoload.php";

	$con = mysqli_connect("localhost","root","","tripago");
		if (mysqli_connect_errno()){
			die(json_encode(["status" => "error", "message" => "Database connection failed"]));
			//echo "Failed to connect to MySQL: " . mysqli_connect_error();
			//die();
		}
	$data = json_decode(file_get_contents("php://input"));
	$url = "";

	$error="";
	//if(isset($_POST["email"]) && (!empty($_POST["email"]))){
	if(isset($data->email) && (!empty($data->email))){
		//$email = $_POST["email"];
		$email = $con->real_escape_string($data->email);
		$email = filter_var($email, FILTER_SANITIZE_EMAIL);
		$email = filter_var($email, FILTER_VALIDATE_EMAIL);
		if (!$email) {
		   //$error .="<p>Invalid email address please type a valid email address!</p>";
		   echo json_encode(["status" => "error", "message" => "Enter a valid email"]);
		   exit;
		}else{
			// THIS WAS CLEANED ON LINES 35-37
		   $sel_query = "SELECT email FROM users WHERE email='$email' LIMIT 1";
		   $results = mysqli_query($con,$sel_query);
		   $row = mysqli_num_rows($results);
		   if ($row==0){
			   echo json_encode(["status" => "error", "message" => "Email not found"]);
			   exit;
		   }
		}
		$expFormat = mktime(
		date("H"), date("i"), date("s"), date("m") ,date("d")+1, date("Y")
		);
		$expDate = date("Y-m-d H:i:s",$expFormat);
		$token = bin2hex(random_bytes(16));
		$token_hash = hash("sha256", $token);
	   
		$key = $token;
	
		// Insert token (key) into table
		// All these variables were either made by us in the backend or were cleaned previously
		//$sel_query = "UPDATE users SET reset_token='$key', reset_token_expires= '$expDate' WHERE email='$email'";
		//if (!$results = mysqli_query($con, $sel_query)) {
		//	echo json_encode(["status" => "error", "message" => "Unable to update user: $email"]);
		//	exit;
		//} 
		//echo json_encode(["status" => "success", "message" => "updated user: $email, $key"]);
		//exit;
		//$row = mysqli_num_rows($results);
		//if ($row==0){
		//	echo json_encode(["status" => "error", "message" => "Unable to update user"]);
		//	exit;
		//}
		//"INSERT INTO `users` (`email`, `key`, `expDate`) VALUES ('".$email."', '".$key."', '".$expDate."');");
		
		// data passed in from the modal box.
		//$location = $data["location"];
		$quote = $data->quote;
		$trip = $data->trip;
		$userName = "Test";//$data->userName;
		$imageUrl = $data->tripImage;
		
		$output ='<p>A User sent you their trip details.</p>';
		$output.='<p>-------------------------------------------------------------</p>';
		$output.='<img src='.$imageUrl.'>';
		$output.='<p>Quote from users trip from '.$trip.': '.$quote;
		$output.='<p>-------------------------------------------------------------</p>';
		$body = $output; 
		$subject = 'Message from '.$userName;
		$emailSentNotification = "If the email doesnt show up in your inbox please check the junk/spam folder.";

		$email_to = $email;
		$fromserver = "[npulaaa@gmail.com]"; // enter email in brackets
		//require("PHPMailer/PHPMailerAutoload.php");
	
		
		$mail = new PHPMailer();
		//$mail->SMTPDebug = SMTP::DEBUG_SERVER;
		$mail->IsSMTP();
		$mail->Host = "smtp.gmail.com"; // Enter your host here
		$mail->SMTPAuth = true;
		$mail->Username = "npulaaa@gmail.com"; // Enter your email here
		$mail->Password = "sjdi xwyh jbpi sxvo"; //Enter your password here
		$mail->Port = 465;
		$mail->IsHTML(true);
		$mail->From = "npulaaa@gmail.com";
		$mail->FromName = "Tripago";
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
		//$mail->Sender = $fromserver; // indicates ReturnPath header
		$mail->Subject = $subject;
		$mail->Body = $body;
		$mail->AddAddress($email_to);
		
		// Add image attachments
		if (isset($data->images)) {
			foreach ($data->images as $image) {
				$imageData = base64_decode($image->data);
				$filename = preg_replace("/[^a-zA-Z0-9\._-]/", "", $image->filename); // sanitize filename
				$mail->addStringAttachment($imageData, $filename, 'base64', $image->type);
			}
		}
		if(!$mail->Send()){
			//echo "Mailer Error: " . $mail->ErrorInfo;
			echo json_encode(["status" => "success", "message" => "Mailer Error: " . $mail->ErrorInfo]);
			exit;
		} 

		//echo json_encode(["status" => "success", "message" => "Email sent:", "resetLink" => $url]);
		echo json_encode(["status" => "success", "message" => "Email sent:", "resetLink" => $emailSentNotification]);
		exit;		
	}else{
		echo json_encode(["status" => "error", "message" => "Email is required"]);
		exit;
	}
?>