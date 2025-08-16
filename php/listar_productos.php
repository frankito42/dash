<?php
header('Content-Type: application/json');
require 'conn.php';
try {
    $stmt = $conn->query('SELECT id, nombre, categoria, cantidad, costo, precio, codigo_barra, imagen FROM productos ORDER BY id DESC');
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'productos' => $productos]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
