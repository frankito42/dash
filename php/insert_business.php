<?php
header('Content-Type: application/json');
require 'conn.php'; // Este archivo debe crear $conn (instancia de PDO)

try {
    // Recibir datos del formulario
    $admin_id      = $_POST['admin_id'] ?? 22;
    $name          = $_POST['name'] ?? '';
    $telefono      = $_POST['telefono'] ?? '';
    $dreccion      = $_POST['dreccion'] ?? '';
    $ciudad        = $_POST['ciudad'] ?? '';
    $provincia     = $_POST['provincia'] ?? '';
    $pais          = $_POST['pais'] ?? '';
    $codigo_postal = $_POST['codigo_postal'] ?? '';
    $descripcion   = $_POST['descripcion'] ?? '';
    $horario_apertura = $_POST['horario_apertura'] ?? '';
    $horario_cierre   = $_POST['horario_cierre'] ?? '';
    $dias_trabajo     = $_POST['dias_trabajo'] ?? '';
    $website      = $_POST['website'] ?? '';
    $instagram    = $_POST['instagram'] ?? '';
    $facebook     = $_POST['facebook'] ?? '';
    $whatsapp     = $_POST['whatsapp'] ?? '';
    $moneda       = $_POST['moneda'] ?? '';
    $tipo_facturacion = $_POST['tipo_facturacion'] ?? '';
    $created_at   = $_POST['created_at'] ?? date('Y-m-d H:i:s');

    // Validación básica
    if (!$name) {
        echo json_encode(['success' => false, 'message' => 'Falta el nombre del negocio']);
        exit;
    }

    // Insertar en la base de datos
    $sql = "INSERT INTO businesses 
        (admin_id, name, telefono, dreccion, ciudad, provincia, pais, codigo_postal, descripcion, horario_apertura, horario_cierre, dias_trabajo, website, instagram, facebook, whatsapp, moneda, tipo_facturacion, created_at) 
        VALUES 
        (:admin_id, :name, :telefono, :dreccion, :ciudad, :provincia, :pais, :codigo_postal, :descripcion, :horario_apertura, :horario_cierre, :dias_trabajo, :website, :instagram, :facebook, :whatsapp, :moneda, :tipo_facturacion, :created_at)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':admin_id'      => $admin_id,
        ':name'          => $name,
        ':telefono'      => $telefono,
        ':dreccion'      => $dreccion,
        ':ciudad'        => $ciudad,
        ':provincia'     => $provincia,
        ':pais'          => $pais,
        ':codigo_postal' => $codigo_postal,
        ':descripcion'   => $descripcion,
        ':horario_apertura' => $horario_apertura,
        ':horario_cierre'   => $horario_cierre,
        ':dias_trabajo'     => $dias_trabajo,
        ':website'      => $website,
        ':instagram'    => $instagram,
        ':facebook'     => $facebook,
        ':whatsapp'     => $whatsapp,
        ':moneda'       => $moneda,
        ':tipo_facturacion' => $tipo_facturacion,
        ':created_at'   => $created_at
    ]);

    echo json_encode(['success' => true, 'message' => 'Negocio guardado correctamente']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}