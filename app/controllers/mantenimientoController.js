const db = require('../db.js'); // Importar conexión a la base de datos
const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";

// Obtener todos los mantenimientos
exports.getAllMantenimientos = async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM ${url_base}.mantenimientos ORDER BY id_mantenimiento DESC`);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los mantenimientos', details: err.message });
    }
};

// Crear un nuevo mantenimiento
exports.createMantenimiento = async (req, res) => {
    try {
        const nuevoMantenimiento = req.body;
        
        // Verificar que al menos se envíe algún dato
        if (!nuevoMantenimiento || Object.keys(nuevoMantenimiento).length === 0) {
            return res.status(400).json({ message: 'Los datos del mantenimiento son requeridos' });
        }

        // Preparar los campos para la inserción (todos pueden ser null)
        const camposPermitidos = [
            'MEMO', 'TIPO_NRO_PROC', 'OBJETO', 'APIA', 'RESOLUCION', 
            'MONTO_INICIADO', 'EMPRESA', 'MONTO_FINAL', 'INICIO', 'FIN', 
            'DURACION', 'PERIODICIDAD', 'OBS', 'DATOS_RELEVANTES', 'PRORROGA'
        ];

        const datosParaInsertar = {};
        
        // Solo incluir campos que están presentes en la petición
        camposPermitidos.forEach(campo => {
            if (nuevoMantenimiento.hasOwnProperty(campo)) {
                datosParaInsertar[campo] = nuevoMantenimiento[campo];
            }
        });

        const [results] = await db.query(`INSERT INTO ${url_base}.mantenimientos SET ?`, [datosParaInsertar]);
        res.status(201).json({ 
            id_mantenimiento: results.insertId, 
            message: 'Mantenimiento creado correctamente',
            data: datosParaInsertar 
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el mantenimiento', details: err.message });
    }
};

// Obtener un mantenimiento por ID
exports.getMantenimientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query(`SELECT * FROM ${url_base}.mantenimientos WHERE id_mantenimiento = ?`, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el mantenimiento', details: err.message });
    }
};

// Actualizar un mantenimiento
exports.updateMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const mantenimientoActualizado = req.body;

        if (!mantenimientoActualizado || Object.keys(mantenimientoActualizado).length === 0) {
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos' });
        }

        // Verificar que el mantenimiento existe
        const [checkResults] = await db.query(`SELECT id_mantenimiento FROM ${url_base}.mantenimientos WHERE id_mantenimiento = ?`, [id]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        // Preparar los campos para la actualización
        const camposPermitidos = [
            'MEMO', 'TIPO_NRO_PROC', 'OBJETO', 'APIA', 'RESOLUCION', 
            'MONTO_INICIADO', 'EMPRESA', 'MONTO_FINAL', 'INICIO', 'FIN', 
            'DURACION', 'PERIODICIDAD', 'OBS', 'DATOS_RELEVANTES', 'PRORROGA'
        ];

        const datosParaActualizar = {};
        
        // Solo incluir campos que están presentes en la petición
        camposPermitidos.forEach(campo => {
            if (mantenimientoActualizado.hasOwnProperty(campo)) {
                datosParaActualizar[campo] = mantenimientoActualizado[campo];
            }
        });

        if (Object.keys(datosParaActualizar).length === 0) {
            return res.status(400).json({ message: 'No hay campos válidos para actualizar' });
        }

        const [results] = await db.query(`UPDATE ${url_base}.mantenimientos SET ? WHERE id_mantenimiento = ?`, [datosParaActualizar, id]);

        res.json({ 
            message: 'Mantenimiento actualizado correctamente',
            updatedFields: Object.keys(datosParaActualizar)
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el mantenimiento', details: err.message });
    }
};

// Eliminar un mantenimiento
exports.deleteMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el mantenimiento existe antes de eliminar
        const [checkResults] = await db.query(`SELECT id_mantenimiento FROM ${url_base}.mantenimientos WHERE id_mantenimiento = ?`, [id]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        const [results] = await db.query(`DELETE FROM ${url_base}.mantenimientos WHERE id_mantenimiento = ?`, [id]);

        res.json({ message: 'Mantenimiento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el mantenimiento', details: err.message });
    }
};

// Obtener mantenimientos por empresa (endpoint adicional útil)
exports.getMantenimientosByEmpresa = async (req, res) => {
    try {
        const { empresa } = req.params;
        const [results] = await db.query(`SELECT * FROM ${url_base}.mantenimientos WHERE EMPRESA = ? ORDER BY id_mantenimiento DESC`, [empresa]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron mantenimientos para esta empresa' });
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener mantenimientos por empresa', details: err.message });
    }
};

// Obtener mantenimientos por rango de fechas (endpoint adicional útil)
exports.getMantenimientosByDateRange = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ message: 'Las fechas de inicio y fin son requeridas' });
        }

        const [results] = await db.query(
            `SELECT * FROM ${url_base}.mantenimientos 
             WHERE INICIO >= ? AND FIN <= ? 
             ORDER BY INICIO DESC`, 
            [fechaInicio, fechaFin]
        );

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener mantenimientos por rango de fechas', details: err.message });
    }
};
