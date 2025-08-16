<?php
// finalizar_caja.php
// Cierra la caja (pone fechaFin) y retorna el estado actualizado
header('Content-Type: application/json');
require_once 'conn.php';

$data = json_decode(file_get_contents('php://input'), true);
$idCaja = isset($data['idCaja']) ? intval($data['idCaja']) : 0;

if (!$idCaja) {
    echo json_encode(['success' => false, 'msg' => 'ID de caja inválido']);
    exit;
}

// Verificar si la caja ya está cerrada

// Usar PDO
try {
    // Verificar si la caja ya está cerrada
    $stmt = $conn->prepare('SELECT fechaFin FROM caja WHERE idCaja = ?');
    $stmt->execute([$idCaja]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && $row['fechaFin']) {
        echo json_encode(['success' => false, 'msg' => 'La caja ya está finalizada']);
        exit;
    }

    // Actualizar fechaFin a ahora
    $stmt = $conn->prepare('UPDATE caja SET fechaFin = NOW() WHERE idCaja = ?');
    $ok = $stmt->execute([$idCaja]);

    if ($ok) {
        // Devolver datos de la caja cerrada
        $stmt = $conn->prepare('SELECT idCaja, idUsuario, idNegocio, fechaInicio, fechaFin FROM caja WHERE idCaja = ?');
        $stmt->execute([$idCaja]);
        $caja = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            'success' => true,
            'msg' => 'Caja finalizada correctamente',
            'caja' => $caja
        ]);
    } else {
        echo json_encode(['success' => false, 'msg' => 'No se pudo finalizar la caja']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'msg' => 'Error: ' . $e->getMessage()]);
}
