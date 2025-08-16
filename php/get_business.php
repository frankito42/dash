<?php
header('Content-Type: application/json');
require_once 'conn.php';

// Obtener el admin_id desde GET o POST
$admin_id = isset($_GET['admin_id']) ? $_GET['admin_id'] : (isset($_POST['admin_id']) ? $_POST['admin_id'] : null);

if (!$admin_id) {
    echo json_encode(['success' => false, 'error' => 'Falta admin_id']);
    exit;
}

try {
    $sql = "SELECT id, admin_id, name, telefono, dreccion, ciudad, provincia, pais, codigo_postal, descripcion, horario_apertura, horario_cierre, dias_trabajo, website, instagram, facebook, whatsapp, moneda, tipo_facturacion, created_at FROM businesses WHERE admin_id = :admin_id LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':admin_id', $admin_id, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode(['success' => true, 'business' => $row]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se encontró negocio']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error en la consulta: ' . $e->getMessage()]);
}
?>
