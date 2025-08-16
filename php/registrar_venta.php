<?php
require_once 'conn.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$idCaja = isset($data['idCaja']) ? intval($data['idCaja']) : 0;
$articulos = isset($data['articulos']) ? $data['articulos'] : [];
$total = isset($data['total']) ? floatval($data['total']) : 0;
$res = ["success" => false, "msg" => ""];

if ($idCaja && $total > 0 && is_array($articulos) && count($articulos) > 0) {
    try {
        $conn->beginTransaction();
        // Insertar venta
        $sqlVenta = "INSERT INTO venta (idCaja, fecha, total) VALUES (:idCaja, NOW(), :total)";
        $stmtVenta = $conn->prepare($sqlVenta);
        $stmtVenta->execute([
            ':idCaja' => $idCaja,
            ':total' => $total
        ]);
        $idVenta = $conn->lastInsertId();
        // Insertar detalle y descontar stock
        $sqlDetalle = "INSERT INTO detalle_venta (idVenta, nombre, costo, precio, cantidad) VALUES (:idVenta, :nombre, :costo, :precio, :cantidad)";
        $stmtDetalle = $conn->prepare($sqlDetalle);
        $sqlStock = "UPDATE productos SET cantidad = cantidad - :cantidad WHERE id = :idProducto AND cantidad >= :cantidad";
        $stmtStock = $conn->prepare($sqlStock);
        foreach ($articulos as $art) {
            // Insertar detalle
            $stmtDetalle->execute([
                ':idVenta' => $idVenta,
                ':nombre' => $art['nombre'],
                ':costo' => isset($art['costo']) ? $art['costo'] : 0,
                ':precio' => $art['precio'],
                ':cantidad' => $art['cantidad']
            ]);
            // Descontar stock
            $stmtStock->execute([
                ':cantidad' => $art['cantidad'],
                ':idProducto' => $art['id']
            ]);
            if ($stmtStock->rowCount() === 0) {
                throw new Exception('Stock insuficiente para ' . $art['nombre']);
            }
        }
        $conn->commit();
        $res['success'] = true;
    } catch (Exception $e) {
        $conn->rollBack();
        $res['msg'] = $e->getMessage();
    }
} else {
    $res['msg'] = 'Datos incompletos';
}
echo json_encode($res);
