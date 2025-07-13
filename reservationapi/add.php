<?php
    require 'connect.php';

    // Get the posted data
    $postdata = file_get_contents("php://input");

    if(isset($postdata) && !empty($postdata))
    {

        // Extract the data
        $request = json_decode($postdata);

        // Validate
        if(trim($request->data->area) === '' || trim($request->data->start_time) === '' ||
            trim($request->data->end_time) === '' || trim($request->data->booked) === '' )
            {
                return http_response_code(400);
            }

        // Sanitize
        $area = mysqli_real_escape_string($con, trim($request->data->area));
        $start_time = mysqli_real_escape_string($con, trim($request->data->start_time));
        $end_time = mysqli_real_escape_string($con, trim($request->data->end_time));
        $booked = mysqli_real_escape_string($con, trim($request->data->booked));
        $imageName = mysqli_real_escape_string($con, trim($request->data->imageName));

        $origimg = str_replace('\\', '/', $imageName);
        $new = basename($origimg);

        if (empty($new))
        {
            $new = 'placeholder_100.jpg';
        }

        // Store the data
        $sql = "INSERT INTO `reservations`(`id`,`area`,`start_time`, `end_time`, `booked`, `imageName`) VALUES (null,'{$area}','{$start_time}','{$end_time}','{$booked}','{$new}')";

        if(mysqli_query($con, $sql))
        {
            http_response_code(201);

            $reservation = [
                'area' => $area,
                'start_time' => $start_time,
                'end_time' => $end_time,
                'booked' => $booked,
                'imageName' => $new,
                'id' => mysqli_insert_id($con)
            ];

            echo json_encode(['data'=>$reservation]);
        }
        else
        {
            http_response_code(422);
        }

    }
    
?>