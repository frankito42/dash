<?php
header('Content-Type: application/json');
require 'conn.php';

try {
    // Validar campos obligatorios
    $nombre = $_POST['nombre'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $cantidad = $_POST['cantidad'] ?? 0;
    $costo = $_POST['costo'] ?? 0;
    $precio = $_POST['precio'] ?? 0;
    $codigoBarra = $_POST['codigoBarra'] ?? '';
    $fechaCreacion = $_POST['fechaCreacion'] ?? date('Y-m-d H:i:s');
    
    if (!$nombre || !$categoria || !$cantidad || !$costo || !$precio) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
        exit;
    }

    // Manejo de imagen
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
        // Guardar solo la ruta relativa para la web
        $imgPath = 'img/productos/' . $imgName;
    }

    // Insertar en la base de datos
    $sql = "INSERT INTO productos (nombre, categoria, cantidad, costo, precio, codigo_barra, imagen, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$nombre, $categoria, $cantidad, $costo, $precio, $codigoBarra, $imgPath, $fechaCreacion]);

    echo json_encode(['success' => true, 'message' => 'Producto creado correctamente']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
