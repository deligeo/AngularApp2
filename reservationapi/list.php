<?php

    require 'connect.php';

    $reservations = [];

    $sql = "SELECT id, area, start_time, end_time, booked, imageName FROM reservations";

    if($result = mysqli_query($con, $sql))
    {
        $count = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $reservations[$count]['id'] = $row['id'];
            $reservations[$count]['area'] = $row['area'];
            $reservations[$count]['start_time'] = $row['start_time'];
            $reservations[$count]['end_time'] = $row['end_time'];
            $reservations[$count]['booked'] = $row['booked'];
            $reservations[$count]['imageName'] = $row['imageName'];

            $count++;
        }

        echo json_encode(['data'=>$reservations]);
    }

    else
    {
        http_response_code(404);
    }
?>