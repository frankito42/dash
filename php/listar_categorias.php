<?php
require_once 'conn.php';
header('Content-Type: application/json');


$sql = "SELECT id, nombre FROM categorias ORDER BY nombre ASC";
$stmt = $conn->query($sql);
$categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'categorias' => $categorias]);
