<?php
require_once 'conn.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$idUsuario = isset($data['idUsuario']) ? intval($data['idUsuario']) : 0;
$idNegocio = isset($data['idNegocio']) ? intval($data['idNegocio']) : 0;
$res = ["success" => false];
if ($idUsuario && $idNegocio) {
  $fechaInicio = date('Y-m-d H:i:s');
  $sql = "INSERT INTO caja (idUsuario, idNegocio, fechaInicio) VALUES (:idUsuario, :idNegocio, :fechaInicio)";
  $stmt = $conn->prepare($sql);
  if ($stmt && $stmt->execute([
    ':idUsuario' => $idUsuario,
    ':idNegocio' => $idNegocio,
    ':fechaInicio' => $fechaInicio
  ])) {
    $res["success"] = true;
    $res["idCaja"] = $conn->lastInsertId();
  }
}
echo json_encode($res);
