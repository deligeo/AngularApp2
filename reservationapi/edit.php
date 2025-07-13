<?php

    require 'connect.php';

    // Get the posted data
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {

        // Extract the data
        $request = json_decode($postdata);

        // Validate
        if((int)$request->data->id < 1 || trim($request->data->area) === ''|| trim($request->data->start_time) === ''|| trim($request->data->end_time) === ''|| trim($request->data->booked) === '')
        {
            return http_response_code(400); // 400 - Bad Request
        }

        // Sanitize
        $id = mysqli_real_escape_string($con, (int)$request->data->id);
        $area = mysqli_real_escape_string($con, $request->data->area);
        $start_time = mysqli_real_escape_string($con, $request->data->start_time);
        $end_time = mysqli_real_escape_string($con, $request->data->end_time);
        $booked = mysqli_real_escape_string($con, $request->data->booked);

        $sql = "UPDATE `reservations` SET `area`='$area', `start_time`='$start_time', `end_time`='$end_time', `booked`='$booked' WHERE `id` = '{$id}' LIMIT 1";

        if(mysqli_query($con, $sql))
        {
            http_response_code(204); // 204 - No content: Processed the request and no content is to be returned
        }
        else 
        {
            http_response_code(422);
        }
    }

?>