<?php
require_once 'conn.php';
header('Content-Type: application/json');

$idCaja = isset($_GET['idCaja']) ? intval($_GET['idCaja']) : 0;

if (!$idCaja) {
    echo json_encode(['success' => false, 'msg' => 'Falta idCaja']);
    exit;
}

try {
    // Usar $conn en vez de $pdo
    $stmt = $conn->prepare('SELECT idVenta AS id, idCaja, fecha, total FROM venta WHERE idCaja = ? ORDER BY fecha DESC');
    $stmt->execute([$idCaja]);
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'ventas' => $ventas]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'msg' => 'Error al consultar ventas', 'error' => $e->getMessage()]);
}
