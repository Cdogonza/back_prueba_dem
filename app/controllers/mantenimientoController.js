const db = require('../db.js'); // Importar conexión a la base de datos
const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";

// Función para convertir fechas ISO a formato MySQL
const convertirFechaParaMySQL = (fecha) => {
    if (!fecha) return fecha;
    
    // Si es una fecha ISO (contiene 'T' y 'Z'), convertirla
    if (typeof fecha === 'string' && (fecha.includes('T') || fecha.includes('Z'))) {
        try {
            const fechaObj = new Date(fecha);
            // Verificar que la fecha es válida
            if (isNaN(fechaObj.getTime())) {
                return fecha; // Retornar la fecha original si no es válida
            }
            // Convertir a formato YYYY-MM-DD
            return fechaObj.toISOString().split('T')[0];
        } catch (error) {
            return fecha; // Retornar la fecha original si hay error
        }
    }
    
    return fecha;
};

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
            'DURACION', 'PERIODICIDAD', 'OBS', 'DATOS_RELEVANTES', 'PRORROGA','ES_PRORROGA'
        ];

        const datosParaInsertar = {};
        
        // Solo incluir campos que están presentes en la petición
        camposPermitidos.forEach(campo => {
            if (nuevoMantenimiento.hasOwnProperty(campo)) {
                let valor = nuevoMantenimiento[campo];
                
                // Convertir fechas si es necesario
                if (campo === 'INICIO' || campo === 'FIN') {
                    valor = convertirFechaParaMySQL(valor);
                }
                
                datosParaInsertar[campo] = valor;
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

        // Preparar los campos para la actualización (todos son opcionales)
        const camposPermitidos = [
            'MEMO', 'TIPO_NRO_PROC', 'OBJETO', 'APIA', 'RESOLUCION', 
            'MONTO_INICIADO', 'EMPRESA', 'MONTO_FINAL', 'INICIO', 'FIN', 
            'DURACION', 'PERIODICIDAD', 'OBS', 'DATOS_RELEVANTES', 'PRORROGA',
            'ES_PRORROGA'
        ];

        const datosParaActualizar = {};
        
        // Solo incluir campos que están presentes en la petición
        camposPermitidos.forEach(campo => {
            if (mantenimientoActualizado.hasOwnProperty(campo)) {
                let valor = mantenimientoActualizado[campo];
                
                // Convertir fechas si es necesario
                if (campo === 'INICIO' || campo === 'FIN') {
                    valor = convertirFechaParaMySQL(valor);
                }
                
                datosParaActualizar[campo] = valor;
            }
        });

        if (Object.keys(datosParaActualizar).length === 0) {
            return res.status(400).json({ message: 'No hay campos válidos para actualizar' });
        }

        const [results] = await db.query(`UPDATE ${url_base}.mantenimientos SET ? WHERE id_mantenimiento = ?`, [datosParaActualizar, id]);

        res.json({ 
            message: 'Mantenimiento actualizado correctamente',
            updatedFields: Object.keys(datosParaActualizar),
            updatedData: datosParaActualizar
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

// Alternar el valor de PRORROGA (true/false)
exports.toggleProrroga = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el mantenimiento existe
        const [checkResults] = await db.query(`SELECT id_mantenimiento, PRORROGA FROM ${url_base}.mantenimientos WHERE id_mantenimiento = ?`, [id]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        const valorActual = checkResults[0].PRORROGA;
        const nuevoValor = valorActual ? 0 : 1;

        // Actualizar el valor de PRORROGA
        const [results] = await db.query(
            `UPDATE ${url_base}.mantenimientos SET PRORROGA = ? WHERE id_mantenimiento = ?`, 
            [nuevoValor, id]
        );

        res.json({ 
            message: 'PRORROGA actualizada correctamente',
            id_mantenimiento: id,
            valorAnterior: valorActual,
            valorNuevo: nuevoValor
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al alternar PRORROGA', details: err.message });
    }
};
