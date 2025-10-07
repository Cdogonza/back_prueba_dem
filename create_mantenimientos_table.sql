-- Script para crear la tabla mantenimientos
-- Base de datos: MySQL

CREATE TABLE IF NOT EXISTS mantenimientos (
    id_mantenimiento INT AUTO_INCREMENT PRIMARY KEY,
    MEMO VARCHAR(255) NULL,
    TIPO_NRO_PROC VARCHAR(255) NULL,
    OBJETO VARCHAR(255) NULL,
    APIA VARCHAR(255) NULL,
    RESOLUCION VARCHAR(255) NULL,
    MONTO_INICIADO DOUBLE NULL,
    EMPRESA VARCHAR(255) NULL,
    MONTO_FINAL DOUBLE NULL,
    INICIO DATE NULL,
    FIN DATE NULL,
    DURACION VARCHAR(255) NULL,
    PERIODICIDAD VARCHAR(255) NULL,
    OBS LONGTEXT NULL,
    DATOS_RELEVANTES LONGTEXT NULL,
    PRORR BOOLEAN NULL
);

-- Comentarios adicionales sobre la tabla
ALTER TABLE mantenimientos COMMENT = 'Tabla para almacenar información de mantenimientos';

-- Índices opcionales para mejorar el rendimiento (descomenta si los necesitas)
-- CREATE INDEX idx_mantenimientos_empresa ON mantenimientos(EMPRESA);
-- CREATE INDEX idx_mantenimientos_inicio ON mantenimientos(INICIO);
-- CREATE INDEX idx_mantenimientos_fin ON mantenimientos(FIN);
-- CREATE INDEX idx_mantenimientos_tipo ON mantenimientos(TIPO_NRO_PROC);
