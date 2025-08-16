<?php
require_once 'conn.php';
header('Content-Type: application/json');

$idVenta = isset($_GET['idVenta']) ? intval($_GET['idVenta']) : 0;
if (!$idVenta) {
    echo json_encode(['success' => false, 'msg' => 'ID de venta inválido']);
    exit;
}

try {
    $stmt = $conn->prepare('SELECT idDetalle, idVenta, nombre, costo, precio, cantidad FROM detalle_venta WHERE idVenta = ?');
    $stmt->execute([$idVenta]);
    $articulos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $total = 0;
    foreach ($articulos as $a) {
        $total += floatval($a['precio']) * intval($a['cantidad']);
    }
    echo json_encode([
        'success' => true,
        'articulos' => $articulos,
        'total' => $total
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'msg' => 'Error al obtener detalles', 'error' => $e->getMessage()]);
}
