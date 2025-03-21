const promisePool = require('../db'); // Asegúrate de que este archivo exporte una instancia de mysql2/promise

const facturacionController = {
    // Obtener todas las facturaciones
    getAll: async (req, res) => {
        try {
            const [rows] = await promisePool.query('SELECT * FROM u154726602_equipos.facturacion');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },

    // Insertar una nueva facturación
    insert: async (req, res) => {
        const { fecha, empresa, monto } = req.body;

        // Validar que todos los campos estén presentes
        if (!fecha || !empresa || !monto) {
            return res.status(400).json({ error: 'Todos los campos (fecha, empresa, monto) son requeridos' });
        }

        try {
            const [result] = await promisePool.query(
                'INSERT INTO u154726602_equipos.facturacion (fecha, empresa, monto, estado) VALUES (?, ?, ?, "pendiente")',
                [fecha, empresa, monto]
            );
            res.status(201).json({ id: result.insertId, fecha, empresa, monto });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },

    // Actualizar una facturación existente
    update: async (req, res) => {
        const { idfacturacion, fecha, empresa, monto } = req.body;

        // Validar que todos los campos estén presentes
        if (!idfacturacion || !fecha || !empresa || !monto) {
            return res.status(400).json({ error: 'Todos los campos (idfacturacion, fecha, empresa, monto) son requeridos' });
        }

        try {
            const [result] = await promisePool.query(
                'UPDATE u154726602_equipos.facturacion SET fecha = ?, empresa = ?, monto = ? WHERE idfacturacion = ?',
                [fecha, empresa, monto, idfacturacion]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Facturación no encontrada' });
            }
            res.status(200).json({ idfacturacion, fecha, empresa, monto });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },

    // Eliminar una facturación
    delete: async (req, res) => {
        const { idfacturacion } = req.body;

        // Validar que el ID esté presente
        if (!idfacturacion) {
            return res.status(400).json({ error: 'El campo idfacturacion es requerido' });
        }

        try {
            const [result] = await promisePool.query('DELETE FROM u154726602_equipos.facturacion WHERE idfacturacion = ?', [idfacturacion]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Facturación no encontrada' });
            }
            res.status(200).json({ message: 'Facturación eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },

    // Calcular el total de la facturación
    totalPagado: async (req, res) => {
        try {
            const [rows] = await promisePool.query(`
                SELECT SUM(monto) AS total 
                FROM u154726602_equipos.facturacion 
                WHERE estado LIKE '%pagado%'
            `);
            res.status(200).json({ total: rows[0].total || 0 });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    totalPendiente: async (req, res) => {
        try {
            const [rows] = await promisePool.query(`
                SELECT SUM(monto) AS total 
                FROM u154726602_equipos.facturacion 
                WHERE estado LIKE '%pendiente%'
            `);
            res.status(200).json({ total: rows[0].total || 0 });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    updateEstado : async (req, res) => {
        const { idfacturacion } = req.body; // Obtén el ID de la facturación desde el cuerpo de la solicitud
    
        try {
            // Paso 1: Obtener el estado actual
            const [rows] = await promisePool.query(
                'SELECT estado FROM u154726602_equipos.facturacion WHERE idfacturacion = ?',
                [idfacturacion]
            );
    
            // Verificar si el registro existe
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Facturación no encontrada' });
            }
    
            const estadoActual = rows[0].estado; // Obtener el estado actual
    
            // Paso 2: Determinar el nuevo estado
            let nuevoEstado;
            if (estadoActual === 'pendiente') {
                nuevoEstado = 'pagado';
            } else if (estadoActual === 'pagado') {
                nuevoEstado = 'pendiente';
            } else {
                return res.status(400).json({ error: 'Estado no válido' });
            }
    
            // Paso 3: Actualizar el registro
            const [result] = await promisePool.query(
                'UPDATE u154726602_equipos.facturacion SET estado = ? WHERE idfacturacion = ?',
                [nuevoEstado, idfacturacion]
            );
    
            // Verificar si la actualización fue exitosa
            if (result.affectedRows === 0) {
                return res.status(500).json({ error: 'No se pudo actualizar el estado' });
            }
    
            // Respuesta exitosa
            res.status(200).json({ 
                message: 'Estado actualizado correctamente', 
                idfacturacion, 
                estadoAnterior: estadoActual, 
                nuevoEstado 
            });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    }
};


module.exports = facturacionController;