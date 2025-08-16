<?php
// listar_proveedores.php
header('Content-Type: application/json');
require_once 'conn.php';

// Leer el business_id desde el POST
$input = json_decode(file_get_contents('php://input'), true);
$business_id = isset($input['business_id']) ? intval($input['business_id']) : 0;

if (!$business_id) {
    echo json_encode(['success' => false, 'error' => 'Falta el id del negocio']);
    exit;
}

try {
    $stmt = $conn->prepare('SELECT * FROM proveedores WHERE business_id = ? ORDER BY id DESC');
    $stmt->execute([$business_id]);
    $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'proveedores' => $proveedores]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
