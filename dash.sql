-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-08-2025 a las 06:14:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dash`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `businesses`
--

CREATE TABLE `businesses` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `dreccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `horario_apertura` varchar(10) DEFAULT NULL,
  `horario_cierre` varchar(10) DEFAULT NULL,
  `dias_trabajo` varchar(100) DEFAULT NULL,
  `website` varchar(150) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `facebook` varchar(100) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `moneda` varchar(10) DEFAULT NULL,
  `tipo_facturacion` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `businesses`
--

INSERT INTO `businesses` (`id`, `admin_id`, `name`, `telefono`, `dreccion`, `ciudad`, `provincia`, `pais`, `codigo_postal`, `descripcion`, `horario_apertura`, `horario_cierre`, `dias_trabajo`, `website`, `instagram`, `facebook`, `whatsapp`, `moneda`, `tipo_facturacion`, `created_at`) VALUES
(2, 24, 'los angeles', '+543 718 5631 24', 'italia 3350', 'clorinda', 'Formosa', 'Argentina', '3610', 'vendo panes', '08:00', '19:00', 'todos', 'https://www.google.com/', 'https://www.ig.com/', 'https://www.feibu.com/', '+222 222', 'ars', 'persona fisica', '2025-06-17 14:44:38'),
(3, 26, 'asdasdasd', '+123 123 123', 'italia 3350', 'clorinda', 'Formosa', 'Argentina', '3610', 'xd', '05:06', '05:10', 'todos', '', '', '', '', 'ars', 'persona fisica', '2025-07-19 08:03:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--

CREATE TABLE `caja` (
  `idCaja` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idNegocio` int(11) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caja`
--

INSERT INTO `caja` (`idCaja`, `idUsuario`, `idNegocio`, `fechaInicio`, `fechaFin`) VALUES
(1, 24, 2, '2025-08-11 16:35:04', '2025-08-11 12:42:11'),
(2, 24, 2, '2025-08-12 16:01:21', '2025-08-12 11:01:41'),
(3, 24, 2, '2025-08-12 16:02:09', '2025-08-12 17:36:25'),
(4, 24, 2, '2025-08-12 22:49:56', '2025-08-12 17:50:15'),
(5, 24, 2, '2025-08-12 22:52:53', '2025-08-12 17:53:26'),
(6, 24, 2, '2025-08-13 01:59:00', '2025-08-12 21:01:57'),
(7, 24, 2, '2025-08-13 02:02:04', '2025-08-13 08:55:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cashbox`
--

CREATE TABLE `cashbox` (
  `id` int(11) NOT NULL,
  `business_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `type` enum('ingreso','egreso') DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(6, 'aguas'),
(1, 'Bebidas'),
(2, 'Comestibles'),
(5, 'Electrónica'),
(4, 'Higiene Personal'),
(3, 'Hogar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `business_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client_debts`
--

CREATE TABLE `client_debts` (
  `id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `closed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client_debt_items`
--

CREATE TABLE `client_debt_items` (
  `id` int(11) NOT NULL,
  `client_debt_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client_debt_payments`
--

CREATE TABLE `client_debt_payments` (
  `id` int(11) NOT NULL,
  `client_debt_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `idDetalle` int(11) NOT NULL,
  `idVenta` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `costo` decimal(12,2) NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`idDetalle`, `idVenta`, `nombre`, `costo`, `precio`, `cantidad`) VALUES
(1, 1, 'papas', 500.00, 2000.00, 1),
(2, 2, 'papas', 500.00, 2000.00, 1),
(3, 3, 'papas', 500.00, 2000.00, 1),
(4, 4, 'papas', 500.00, 2000.00, 4),
(5, 5, 'papas', 500.00, 2000.00, 1),
(7, 7, 'papas', 500.00, 2000.00, 14),
(8, 8, 'prueba', 500.00, 1000.00, 7),
(9, 9, 'prueba', 500.00, 1000.00, 4),
(10, 10, 'prueba', 500.00, 1000.00, 3),
(11, 10, 'coca cola 1.5L', 500.00, 1500.00, 3),
(12, 11, 'coca cola 1.5L', 500.00, 1500.00, 1),
(13, 12, 'coca cola 1.5L', 500.00, 1500.00, 1),
(14, 13, 'coca cola 1.5L', 500.00, 1500.00, 1),
(15, 14, 'coca cola 1.5L', 500.00, 1500.00, 1),
(16, 15, 'coca cola 1.5L', 500.00, 1500.00, 1),
(17, 16, 'prueba', 500.00, 1000.00, 3),
(18, 16, 'coca cola 1.5L', 500.00, 1500.00, 3),
(19, 17, 'prueba', 500.00, 2000.00, 4),
(20, 17, 'coca cola 1.5L', 500.00, 1500.00, 4),
(21, 18, 'prueba', 500.00, 2000.00, 2),
(22, 19, 'prueba', 500.00, 2000.00, 5),
(23, 20, 'prueba', 500.00, 2000.00, 1),
(24, 21, 'coca cola 1.5L', 500.00, 1500.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `business_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `business_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `codigo_barra` varchar(50) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `categoria`, `cantidad`, `costo`, `precio`, `codigo_barra`, `imagen`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'coca cola 1.5L', '1', 15, 500.00, 1500.00, '88888888', 'img/productos/prod_68518400914ef_Captura de pantalla 2025-05-29 102623.png', '2025-06-17 15:04:30', '2025-08-12 22:52:17'),
(2, 'prueba', '5', 1, 500.00, 2000.00, '123123123', 'img/productos/prod_6897e20049b9b_0009---emulsionuva-feed.jpg', '2025-08-07 15:26:13', '2025-08-12 22:52:35'),
(6, 'papas', '1', 0, 500.00, 2000.00, '', NULL, '2025-08-08 04:44:32', '2025-08-11 16:45:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `producto_principal` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `telefono_alternativo` varchar(30) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `sitio_web` varchar(120) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `ciudad` varchar(60) DEFAULT NULL,
  `provincia` varchar(60) DEFAULT NULL,
  `pais` varchar(60) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `condiciones_pago` varchar(30) DEFAULT NULL,
  `moneda` varchar(10) DEFAULT NULL,
  `tiempo_entrega` varchar(40) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `business_id`, `nombre`, `tipo`, `telefono`, `email`, `producto_principal`, `contacto`, `telefono_alternativo`, `whatsapp`, `sitio_web`, `direccion`, `ciudad`, `provincia`, `pais`, `codigo_postal`, `categoria`, `condiciones_pago`, `moneda`, `tiempo_entrega`, `notas`, `fecha_registro`, `estado`) VALUES
(1, 2, 'Pancho Dev 1', 'persona_fisica', '+543 718 5631 24', 'francisco.goonzalez99@gmail.com', 'pancho compus celus', 'Panchito Gon', '+543 719 5631 24', '+543 719 5631 24', 'https://www.google.com/', 'italia 3350', 'Clorinda', 'Formosa', 'Argentina', '3610', 'materias_primas', '15_dias', 'ars', '5', 'xddddddd', '2025-08-13 10:07:10', 'Activo'),
(3, 2, 'Pancho Dev 2', 'empresa', '+123 123 123', 'francisco.goonzalez99@gmail.com', 'asd', 'Asd', '+123', '+123', 'https://asd', 'italia 3350', 'Clorinda', 'Formosa', 'Argentina', '3610', 'oficina', '30_dias', 'ars', '3', 'asd', '2025-08-13 10:10:28', 'Activo'),
(4, 2, 'Pancho Dev 3', 'empresa', '+543 718 5631 24', 'francisco.goonzalez99@gmail.com', 'asdas', 'Francisco Gonzalez', '+123', '+123', 'https://www.google.com/', '3610', 'Clorinda', 'Formosa', 'Argentina', '3610', 'equipos', 'contado', 'ars', '2', 'asdasdasd', '2025-08-13 10:13:25', 'Activo'),
(5, 2, 'Pancho Dev 4', 'persona_fisica', '+543 718 5631 24', 'francisco.goonzalez99@gmail.com', 'asd', 'Asd', '+123 12', '+123 123', 'https://asdasd', 'italia 3350', 'Clorinda', 'Formosa', 'Argentina', '3610', 'materias_primas', 'contado', 'aras', '2', 'asdasd', '2025-08-13 10:16:59', 'Activo'),
(6, 2, 'Pancho Dev 5', 'persona_fisica', '+543 718 5631 24', 'francisco.goonzalez99@gmail.com', 'pancho compus celus', 'Francisco Gonzalez', '+543 718 5631 24', '+123', 'https://www.google.com/', 'italia 3350', 'Clorinda', 'Formosa', 'Argentina', '3610', 'materias_primas', 'contado', 'arsre', '9985', 'huhoi', '2025-08-13 10:20:53', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `business_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase_items`
--

CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'empleado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `created_at`) VALUES
(24, 'francisco javier gonzalez', 'francisco.goonzalez99@gmail.com', '11111111', 1, '2025-06-17 14:40:40'),
(26, 'pancho', 'frankapo42@gmail.com', '11111111', 1, '2025-07-19 08:02:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `idVenta` int(11) NOT NULL,
  `idCaja` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `total` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`idVenta`, `idCaja`, `fecha`, `total`) VALUES
(1, 1, '2025-08-11 11:46:49', 2000.00),
(2, 1, '2025-08-11 11:55:09', 2000.00),
(3, 1, '2025-08-11 11:55:24', 2000.00),
(4, 1, '2025-08-11 11:56:43', 8000.00),
(5, 1, '2025-08-11 11:56:54', 2000.00),
(7, 1, '2025-08-11 12:10:41', 28000.00),
(8, 2, '2025-08-12 11:01:30', 7000.00),
(9, 3, '2025-08-12 11:44:32', 4000.00),
(10, 3, '2025-08-12 17:33:09', 7500.00),
(11, 3, '2025-08-12 17:33:47', 1500.00),
(12, 3, '2025-08-12 17:33:52', 1500.00),
(13, 3, '2025-08-12 17:33:59', 1500.00),
(14, 3, '2025-08-12 17:34:05', 1500.00),
(15, 3, '2025-08-12 17:34:12', 1500.00),
(16, 4, '2025-08-12 17:50:07', 7500.00),
(17, 5, '2025-08-12 17:53:08', 14000.00),
(18, 5, '2025-08-12 17:53:15', 4000.00),
(19, 6, '2025-08-12 21:00:01', 10000.00),
(20, 6, '2025-08-12 21:01:10', 2000.00),
(21, 7, '2025-08-13 08:55:05', 1500.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`idCaja`);

--
-- Indices de la tabla `cashbox`
--
ALTER TABLE `cashbox`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_id` (`business_id`);

--
-- Indices de la tabla `client_debts`
--
ALTER TABLE `client_debts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indices de la tabla `client_debt_items`
--
ALTER TABLE `client_debt_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_debt_id` (`client_debt_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `client_debt_payments`
--
ALTER TABLE `client_debt_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_debt_id` (`client_debt_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`idDetalle`),
  ADD KEY `idVenta` (`idVenta`);

--
-- Indices de la tabla `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `business_id` (`business_id`);

--
-- Indices de la tabla `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_id` (`business_id`);

--
-- Indices de la tabla `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_id` (`business_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indices de la tabla `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`idVenta`),
  ADD KEY `idCaja` (`idCaja`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `idCaja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `cashbox`
--
ALTER TABLE `cashbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `client_debts`
--
ALTER TABLE `client_debts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `client_debt_items`
--
ALTER TABLE `client_debt_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `client_debt_payments`
--
ALTER TABLE `client_debt_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `idDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `purchase_items`
--
ALTER TABLE `purchase_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `idVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cashbox`
--
ALTER TABLE `cashbox`
  ADD CONSTRAINT `cashbox_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
  ADD CONSTRAINT `cashbox_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Filtros para la tabla `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`);

--
-- Filtros para la tabla `client_debts`
--
ALTER TABLE `client_debts`
  ADD CONSTRAINT `client_debts_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);

--
-- Filtros para la tabla `client_debt_items`
--
ALTER TABLE `client_debt_items`
  ADD CONSTRAINT `client_debt_items_ibfk_1` FOREIGN KEY (`client_debt_id`) REFERENCES `client_debts` (`id`),
  ADD CONSTRAINT `client_debt_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `client_debt_payments`
--
ALTER TABLE `client_debt_payments`
  ADD CONSTRAINT `client_debt_payments_ibfk_1` FOREIGN KEY (`client_debt_id`) REFERENCES `client_debts` (`id`),
  ADD CONSTRAINT `client_debt_payments_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`idVenta`) REFERENCES `venta` (`idVenta`);

--
-- Filtros para la tabla `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`);

--
-- Filtros para la tabla `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`);

--
-- Filtros para la tabla `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Filtros para la tabla `purchase_items`
--
ALTER TABLE `purchase_items`
  ADD CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`),
  ADD CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`idCaja`) REFERENCES `caja` (`idCaja`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
