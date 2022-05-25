<?php
session_start();
include 'connect.php';
include 'header.php';

if (!isset($_SESSION['signed_in'])) {
    echo ' Sorry, you have to be <a href="/forum/signin.php">signed in</a> to create a catagory.';
} else {
    echo '<tr>';
    echo '<td class="leftpart">';
    echo '<h3><a href="category.php?id=">Category name</a></h3> Category description goes here';
    echo '</td>';
    echo '<td class="rightpart">';
    echo '<a href="topic.php?id=">Topic subject</a> at 10-10';
    echo '</td>';
    echo '</tr>';
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        echo "<form method='post' action=''>
               Category name: <input type='text' name='cat_name' />
               Category description: <textarea name='cat_description' /></textarea>
               <input type='submit' value='Add category' />
            </form>";
    } else {
        $sql = "INSERT INTO categories(cat_name, cat_description)
                VALUES('" . mysqli_real_escape_string($con, $_POST['cat_name']) . "','" . mysqli_real_escape_string($con, $_POST['cat_description']) . "')";
        $result = mysqli_query($con, $sql);
        if (!$result) {
            echo 'Error' . mysqli_error($con);
        } else {
            echo 'New category successfully added.';
        }
    }
}

include 'footer.php';
