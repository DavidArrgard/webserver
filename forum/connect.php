<?php
$server = 'localhost';
$username   = 'root';
$password   = '';
$database   = 'forum';

$con = new mysqli($server, $username, $password, $database);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

if (!mysqli_connect($server, $username,  $password)) {
    exit('Error: could not establish database connection');
}

if (!mysqli_select_db($con, $database)) {
    exit('Error: could not select the database');
}
