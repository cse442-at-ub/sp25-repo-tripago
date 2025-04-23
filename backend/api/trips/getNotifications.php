<?php
header("Content-Type: application/json");

$comments = [];

echo json_encode(["success" => true, "comments" => $comments]);
?>