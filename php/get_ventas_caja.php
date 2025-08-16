<?php
// get_ventas_caja.php
// Devuelve las ventas y detalles de una caja, y calcula la ganancia total
header('Content-Type: application/json');
require_once 'conn.php';

$idCaja = isset($_GET['idCaja']) ? intval($_GET['idCaja']) : 0;
if (!$idCaja) {
    echo json_encode(['success' => false, 'msg' => 'ID de caja inválido']);
    exit;
}

try {
    // Traer ventas de la caja
    $stmt = $conn->prepare('SELECT idVenta, fecha, total FROM venta WHERE idCaja = ? ORDER BY fecha DESC');
    $stmt->execute([$idCaja]);
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $gananciaCaja = 0;
    foreach ($ventas as &$venta) {
        // Traer detalles de la venta
        $stmt2 = $conn->prepare('SELECT nombre, costo, precio, cantidad FROM detalle_venta WHERE idVenta = ?');
        $stmt2->execute([$venta['idVenta']]);
        $detalles = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        $venta['detalles'] = $detalles;
        // Calcular ganancia de la venta
        $gananciaVenta = 0;
        foreach ($detalles as $d) {
            $gananciaVenta += ($d['precio'] - $d['costo']) * $d['cantidad'];
        }
        $venta['ganancia'] = $gananciaVenta;
        $gananciaCaja += $gananciaVenta;
    }
    echo json_encode(['success' => true, 'ventas' => $ventas, 'gananciaCaja' => $gananciaCaja]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'msg' => 'Error: ' . $e->getMessage()]);
}
