<?php
// total_ingresos.php
// Devuelve la suma total de ventas por negocio (todas las cajas de ese negocio)
header('Content-Type: application/json');
require_once 'conn.php';

$idNegocio = isset($_GET['idNegocio']) ? intval($_GET['idNegocio']) : 0;
if (!$idNegocio) {
    echo json_encode(['success' => false, 'msg' => 'ID de negocio inválido']);
    exit;
}

try {
    // Buscar todas las cajas de ese negocio
    $stmt = $conn->prepare('SELECT idCaja FROM caja WHERE idNegocio = ?');
    $stmt->execute([$idNegocio]);
    $cajas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (!$cajas) {
        echo json_encode(['success' => true, 'total' => 0]);
        exit;
    }
    // Sumar todas las ventas de esas cajas
    $in = str_repeat('?,', count($cajas) - 1) . '?';
    $sql = "SELECT SUM(total) as total FROM venta WHERE idCaja IN ($in)";
    $stmt = $conn->prepare($sql);
    $stmt->execute($cajas);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $total = $row && $row['total'] ? floatval($row['total']) : 0;
    echo json_encode(['success' => true, 'total' => $total]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'msg' => 'Error: ' . $e->getMessage()]);
}
