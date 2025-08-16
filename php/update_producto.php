<?php
header('Content-Type: application/json');
require 'conn.php';

try {
    $id = $_POST['id'] ?? null;
    $nombre = $_POST['nombre'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $cantidad = $_POST['cantidad'] ?? 0;
    $costo = $_POST['costo'] ?? 0;
    $precio = $_POST['precio'] ?? 0;
    $codigoBarra = $_POST['codigoBarra'] ?? '';
    $fechaActualizacion = date('Y-m-d H:i:s');

    if (!$id || !$nombre || !$categoria || $cantidad === '' || $costo === '' || $precio === '') {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
        exit;
    }

    // Manejo de imagen (opcional)
    $imgPath = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $imgTmp = $_FILES['imagen']['tmp_name'];
        $imgName = uniqid('prod_') . '_' . basename($_FILES['imagen']['name']);
        $imgDir = '../img/productos/';
        if (!is_dir($imgDir)) {
            mkdir($imgDir, 0777, true);
        }
        $imgPath = $imgDir . $imgName;
        if (!move_uploaded_file($imgTmp, $imgPath)) {
            echo json_encode(['success' => false, 'message' => 'Error al guardar la imagen']);
            exit;
        }
        $imgPath = 'img/productos/' . $imgName;
    }

    // Actualizar producto
    $sql = "UPDATE productos SET nombre=?, categoria=?, cantidad=?, costo=?, precio=?, codigo_barra=?, fecha_actualizacion=?, imagen=COALESCE(?, imagen) WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $nombre, $categoria, $cantidad, $costo, $precio, $codigoBarra, $fechaActualizacion, $imgPath, $id
    ]);

    echo json_encode(['success' => true, 'message' => 'Producto actualizado correctamente']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
