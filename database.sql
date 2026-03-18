-- Crear base de datos
CREATE DATABASE utn_db;

-- Conectarse a utn_db antes de ejecutar lo siguiente
\c utn_db;

-- Crear tabla
CREATE TABLE usuarios_utn (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(20) NOT NULL,
    clave VARCHAR(20) NOT NULL,
    apellido VARCHAR(50),
    nombre VARCHAR(50),
    bloqueado CHAR(1) DEFAULT 'N'
);

-- Inserts de prueba
INSERT INTO usuarios_utn (usuario, clave, apellido, nombre, bloqueado) VALUES
('admin', '1234', 'García', 'Juan', 'N'),
('mlopez', 'pass123', 'López', 'María', 'N'),
('cperez', 'clave456', 'Pérez', 'Carlos', 'Y'),
('arodriguez', 'abc789', 'Rodríguez', 'Ana', 'N'),
('jmartinez', 'qwerty', 'Martínez', 'José', 'Y');
