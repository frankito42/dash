<?php
// listar_cajas_negocio.php
// Lista todas las cajas de un negocio, con total de ventas por caja y datos de usuario
header('Content-Type: application/json');
require_once 'conn.php';

$idNegocio = isset($_GET['idNegocio']) ? intval($_GET['idNegocio']) : 0;
if (!$idNegocio) {
    echo json_encode(['success' => false, 'msg' => 'ID de negocio inválido']);
    exit;
}

try {
    // Traer todas las cajas del negocio, con usuario
    $sql = "SELECT c.idCaja, c.idUsuario, c.fechaInicio, c.fechaFin, u.username as usuario
                FROM caja c
                LEFT JOIN users u ON c.idUsuario = u.id
                WHERE c.idNegocio = ?
                ORDER BY c.fechaInicio DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$idNegocio]);
    $cajas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!$cajas) {
        echo json_encode(['success' => true, 'cajas' => []]);
        exit;
    }
    // Para cada caja, sumar el total de ventas
    $ids = array_column($cajas, 'idCaja');
    if ($ids) {
        $in = str_repeat('?,', count($ids) - 1) . '?';
        $sqlVentas = "SELECT idCaja, SUM(total) as total FROM venta WHERE idCaja IN ($in) GROUP BY idCaja";
        $stmt = $conn->prepare($sqlVentas);
        $stmt->execute($ids);
        $totales = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    } else {
        $totales = [];
    }
    // Armar resultado
    foreach ($cajas as &$caja) {
        $caja['total'] = isset($totales[$caja['idCaja']]) ? floatval($totales[$caja['idCaja']]) : 0;
    }
    echo json_encode(['success' => true, 'cajas' => $cajas]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'msg' => 'Error: ' . $e->getMessage()]);
}
