<?php
session_start();
include 'connect.php';
include 'header.php';

$sql = "SELECT topic_id, topic_subject FROM topics WHERE topics.topic_id = '" . mysqli_real_escape_string($con, $_GET['id']) . "'";

$result = mysqli_query($con, $sql);

if (!$result) {
    echo 'The category could not be displayed, please try again later.' . mysqli_error($con);
} else {
    if (mysqli_num_rows($result) == 0) {
        echo 'This category does not exist.';
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            echo '<h2>Topics in ′' . $row['topic_subject'] . '′ topic</h2>';
        }
        $sql = "SELECT
                posts.post_topic,
                posts.post_content,
                posts.post_date,
                posts.post_by,
                users.user_id,
                users.user_name
            FROM
                posts
            LEFT JOIN
                users
            ON
                posts.post_by = users.user_id
            WHERE
                posts.post_topic = '" . mysqli_real_escape_string($con, $_GET['id']) . "'";

        $result = mysqli_query($con, $sql);

        if (!$result) {
            echo 'The topics could not be displayed, please try again later.';
        } else {
            if (mysqli_num_rows($result) == 0) {
                echo 'There are no topics in this category yet.';
            } else {
                $x = mysqli_fetch_assoc($result);
                echo '<table border="1">
                      <tr>
                        <th>Date</th>
                        <th>Discussion</th>
                      </tr>';
                echo '<form method="post" action="reply.php?id=' . $x['post_topic'] . '">
                    <textarea name="reply-content"></textarea>
                    <input type="submit" value="Submit reply" />
                    </form>';
                while ($row = mysqli_fetch_assoc($result)) {
                    echo '<tr>';
                    echo '<td>';
                    echo str_replace('<', '/&lt', str_replace('>', '/&gt', $row['user_name']));
                    echo '<br>';
                    echo date('d-m-Y', strtotime($row['post_date']));
                    echo '</td>';
                    echo '<td class="leftpart">';
                    echo str_replace('<', '/&lt', str_replace('>', '/&gt', $row['post_content']));
                    echo '</td>';
                    echo '</tr>';
                }
            }
        }
    }
}
include 'footer.php';
