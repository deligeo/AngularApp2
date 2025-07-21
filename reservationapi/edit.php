<?php
require 'connect.php';
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Parse form data
$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$area = mysqli_real_escape_string($con, $_POST['area'] ?? '');
$start_time = mysqli_real_escape_string($con, $_POST['start_time'] ?? '');
$end_time = mysqli_real_escape_string($con, $_POST['end_time'] ?? '');
$booked = mysqli_real_escape_string($con, $_POST['booked'] ?? '');
$originalImageName = mysqli_real_escape_string($con, $_POST['originalImageName'] ?? '');
$imageName = $originalImageName;

// Validation
if ($id < 1 || $area === '' || $start_time === '' || $end_time === '' || $booked === '' ) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Check for duplicate email (excluding current reservation)
$emailCheckQuery = "SELECT id FROM reservations WHERE end_time = '$end_time' AND id != $id LIMIT 1";
$emailCheckResult = mysqli_query($con, $emailCheckQuery);
if ($emailCheckResult && mysqli_num_rows($emailCheckResult) > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'Email address already exists.']);
    exit;
}

// Check for duplicate imageName (excluding placeholder and same reservation)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    $newImageName = basename($_FILES['image']['name']);

    if ($newImageName !== 'placeholder_100.jpg') {
        $imageCheckQuery = "SELECT id FROM reservations WHERE imageName = '$newImageName' AND id != $id LIMIT 1";
        $imageCheckResult = mysqli_query($con, $imageCheckQuery);
        if ($imageCheckResult && mysqli_num_rows($imageCheckResult) > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'Image name already exists.']);
            exit;
        }
    }

    // Save new image
    $targetFilePath = $uploadDir . $newImageName;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFilePath)) {
        // Delete old image if not placeholder
        if (!empty($originalImageName) && $originalImageName !== 'placeholder_100.jpg' && file_exists($uploadDir . $originalImageName)) {
            unlink($uploadDir . $originalImageName);
        }
        $imageName = $newImageName;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload image.']);
        exit;
    }
}

// Update reservation
$sql = "UPDATE reservations SET 
            area = '$area',
            start_time = '$start_time',
            end_time = '$end_time',
            booked = '$booked',
            imageName = '$imageName'
        WHERE id = $id
        LIMIT 1";

if (mysqli_query($con, $sql)) {
    http_response_code(200);
    echo json_encode(['message' => 'Reservation updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Database update failed']);
}
?>