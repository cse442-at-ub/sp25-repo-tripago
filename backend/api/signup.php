<?php
header("Access-Control-Allow-Origin: *")
header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS")

$json = file_get_contents("php://input");
//data should have dictionary from react?
$data = json_decode($json);






?>