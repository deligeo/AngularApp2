<?php
require 'connect.php';

$id = ($_GET['id'] !== null && (int)$_GET['id'] > 0) ? mysqli_real_escape_string($con, (int)$_GET['id']) : false;

if (!$id) {
    return http_response_code(400);
}

// Step 1: Retrieve the image name for the contact
$query = "SELECT imageName FROM reservations WHERE id = '{$id}' LIMIT 1";
$result = mysqli_query($con, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $imageName = $row['imageName'];

    // Step 2: Only delete the image if it's NOT the placeholder
    if ($imageName !== 'placeholder_100.jpg') {
        $imagePath = __DIR__ . "/uploads/" . $imageName;
        if (file_exists($imagePath)) {
            unlink($imagePath); // Delete the file
        }
    }

    // Step 3: Delete the contact record
    $sql = "DELETE FROM `reservations` WHERE `id` ='{$id}' LIMIT 1";
    if (mysqli_query($con, $sql)) {
        http_response_code(204);
    } else {
        http_response_code(422);
    }

} else {
    http_response_code(404); // Contact not found
}
?>