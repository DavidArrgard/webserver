<?php
session_start();
include 'connect.php';
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo 'This file cannot be called directly.';
} else {
    if (!$_SESSION['signed_in']) {
        echo 'You must be signed in to post a reply.';
    } else {
        $sql = "INSERT INTO 
                    posts(post_content,
                          post_date,
                          post_topic,
                          post_by) 
                VALUES ('" . $_POST['reply-content'] . "',
                        NOW(),
                        " . mysqli_real_escape_string($con, $_GET['id']) . ",
                        " . $_SESSION['user_id'] . ")";

        $result = mysqli_query($con, $sql);

        if (!$result) {
            echo 'Your reply has not been saved, please try again later. ' . mysqli_error($con);
        } else {
            echo 'Your reply has been saved, check out <a href="topic.php?id=' . htmlentities($_GET['id']) . '">the topic</a>.';
        }
    }
}
include 'footer.php';
