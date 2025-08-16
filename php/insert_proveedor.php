<?php
require_once 'conn.php';
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) throw new Exception('No data received');

    // Validar campos mínimos
    if (empty($data['business_id']) || empty($data['nombre'])) {
        throw new Exception('Faltan campos obligatorios');
    }

    $sql = "INSERT INTO proveedores (
        business_id, nombre, tipo, telefono, email, producto_principal, contacto, telefono_alternativo, whatsapp, sitio_web, direccion, ciudad, provincia, pais, codigo_postal, categoria, condiciones_pago, moneda, tiempo_entrega, notas
    ) VALUES (
        :business_id, :nombre, :tipo, :telefono, :email, :producto_principal, :contacto, :telefono_alternativo, :whatsapp, :sitio_web, :direccion, :ciudad, :provincia, :pais, :codigo_postal, :categoria, :condiciones_pago, :moneda, :tiempo_entrega, :notas
    )";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':business_id' => $data['business_id'],
        ':nombre' => $data['nombre'],
        ':tipo' => $data['tipo'] ?? null,
        ':telefono' => $data['telefono'] ?? null,
        ':email' => $data['email'] ?? null,
        ':producto_principal' => $data['producto_principal'] ?? null,
        ':contacto' => $data['contacto'] ?? null,
        ':telefono_alternativo' => $data['telefono_alternativo'] ?? null,
        ':whatsapp' => $data['whatsapp'] ?? null,
        ':sitio_web' => $data['sitio_web'] ?? null,
        ':direccion' => $data['direccion'] ?? null,
        ':ciudad' => $data['ciudad'] ?? null,
        ':provincia' => $data['provincia'] ?? null,
        ':pais' => $data['pais'] ?? null,
        ':codigo_postal' => $data['codigo_postal'] ?? null,
        ':categoria' => $data['categoria'] ?? null,
        ':condiciones_pago' => $data['condiciones_pago'] ?? null,
        ':moneda' => $data['moneda'] ?? null,
        ':tiempo_entrega' => $data['tiempo_entrega'] ?? null,
        ':notas' => $data['notas'] ?? null
    ]);

    echo json_encode(['success' => true, 'message' => 'Proveedor creado correctamente']);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
