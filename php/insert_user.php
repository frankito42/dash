<?php
require 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['pass'] ?? '';

    if ($username && $email && $password) {
        try {
            $stmt = $conn->prepare("INSERT INTO users (username, email, password, role_id, created_at) VALUES (:username, :email, :password, 1, NOW())");
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':password' => $password
            ]);

            $userId = $conn->lastInsertId();

            echo json_encode([
                'success' => true,
                'message' => 'Usuario registrado correctamente.',
                'user' => [
                    'id' => $userId,
                    'username' => $username,
                    'email' => $email,
                    'role_id' => 1
                ]
            ]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Email duplicado. Por favor, utiliza otro email.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
// Cerrar la conexión
$conn = null;