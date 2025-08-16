<?php
require_once 'conn.php';
header('Content-Type: application/json');
$idUsuario = isset($_GET['idUsuario']) ? intval($_GET['idUsuario']) : 0;
$idNegocio = isset($_GET['idNegocio']) ? intval($_GET['idNegocio']) : 0;
$res = ["abierta" => false];
if ($idUsuario && $idNegocio) {
  $sql = "SELECT idCaja FROM caja WHERE idUsuario = :idUsuario AND idNegocio = :idNegocio AND fechaFin IS NULL LIMIT 1";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
  $stmt->bindParam(':idNegocio', $idNegocio, PDO::PARAM_INT);
  $stmt->execute();
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($row) {
    $res["abierta"] = true;
    $res["idCaja"] = $row["idCaja"];
  }
}
echo json_encode($res);
