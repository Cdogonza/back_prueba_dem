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
        const { fecha, empresa, monto, estado, observacion } = req.body;

        // Validar que todos los campos estén presentes
        if (!fecha || !empresa || !monto) {
            return res.status(400).json({ error: 'Todos los campos (fecha, empresa, monto) son requeridos' });
        }

        try {
            const [result] = await promisePool.query(
                'INSERT INTO u154726602_equipos.facturacion (fecha, empresa, monto, estado,observacion) VALUES (?, ?, ?, ?,?)',
                [fecha, empresa, monto, estado, observacion]
            );
            res.status(201).json({ id: result.insertId, fecha, empresa, monto, estado, observacion });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    insertEntrada: async (req, res) => {
        const { id, monto,fecha, username, motivo } = req.body.entrada;
        if (!fecha || !monto|| !motivo || !username) {
            return res.status(400).json({ error: 'Todos los campos (fecha, monto, username, motivo) son requeridos' });
        }

        try {
            const [result] = await promisePool.query(
                'INSERT INTO u154726602_equipos.entrada (fecha, monto, username, motivo) VALUES (?, ?, ?, ?)',
                [fecha, monto, username, motivo]
            );
            res.status(201).json({ fecha, monto, username, motivo });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    updateEntrada: async (req, res) => {
        const { id, monto,fecha, username, motivo } = req.body.entrada;
       
        const identrada = req.params.identrada; // ID de la entrada a actualizar
        try{
            const [result] = await promisePool.query(
                'UPDATE u154726602_equipos.entrada SET fecha = ?, monto = ?, username = ?, motivo = ? WHERE identrada = ?',
                [fecha, monto, username, motivo, identrada]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Entrada no encontrada o ningún cambio aplicado' });
            }

            // Devuelve el objeto actualizado (opcional)
            const [updatedRow] = await promisePool.query(
                'SELECT * FROM u154726602_equipos.entrada WHERE identrada = ?',
                [identrada]
            );

            res.status(200).json(updatedRow[0]);
        }
        catch (error) {
            console.error('Error al actualizar entrada:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

    },
    deleteEntrada: async (req, res) => {
        const { identrada } = req.params;

        try {
            const [result] = await promisePool.query('DELETE FROM u154726602_equipos.entrada WHERE identrada = ?', [identrada]);
            console.log('Resultado de la consulta:', result); // Depuración
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Entrada no encontrada' });
            }
            res.status(200).json({ message: 'Entrada eliminada correctamente' });
        }
        catch (error) { 
            console.error('Error en la base de datos:', error); // Depuración
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },

    // Actualizar una facturación existente
    // Actualizar una facturación existente
    update: async (req, res) => {
        const { idfacturacion, fecha, empresa, monto, estado, observacion } = req.body;

        // Validar campos requeridos
        if (!idfacturacion || !fecha || !empresa || !monto || !estado) { // "observacion" puede ser opcional
            return res.status(400).json({
                error: 'Campos requeridos: idfacturacion, fecha, empresa, monto, estado'
            });
        }

        try {
            const [result] = await promisePool.query(
                'UPDATE u154726602_equipos.facturacion SET fecha = ?, empresa = ?, monto = ?, estado = ?, observacion = ? WHERE idfacturacion = ?',
                [fecha, empresa, monto, estado, observacion || null, idfacturacion] // observacion puede ser null
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Facturación no encontrada o ningún cambio aplicado' });
            }

            // Devuelve el objeto actualizado (opcional)
            const [updatedRow] = await promisePool.query(
                'SELECT * FROM u154726602_equipos.facturacion WHERE idfacturacion = ?',
                [idfacturacion]
            );

            res.status(200).json(updatedRow[0]);

        } catch (error) {
            console.error('Error al actualizar facturación:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Eliminar una facturación
    delete: async (req, res) => {
        const { idfacturacion } = req.params;
        console.log('ID recibido:', idfacturacion); // Depuración

        if (!idfacturacion) {
            return res.status(400).json({ error: 'El campo idfacturacion es requerido' });
        }

        try {
            const [result] = await promisePool.query('DELETE FROM u154726602_equipos.facturacion WHERE idfacturacion = ?', [idfacturacion]);
            console.log('Resultado de la consulta:', result); // Depuración
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Facturación no encontrada' });
            }
            res.status(200).json({ message: 'Facturación eliminada correctamente' });
        } catch (error) {
            console.error('Error en la base de datos:', error); // Depuración
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
    totalEntrada: async (req, res) => {
        try {
            const [rows] = await promisePool.query(`
                SELECT SUM(monto) AS total 
                FROM u154726602_equipos.entrada 
            `);
            res.status(200).json({ total: rows[0].total || 0 });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    totalCaja: async (req, res) => {
        try {
            const [rows] = await promisePool.query(`
                SELECT 
    (SELECT COALESCE(SUM(monto), 0) FROM u154726602_equipos.entrada) -
    (SELECT COALESCE(SUM(monto), 0) FROM u154726602_equipos.facturacion WHERE estado LIKE '%pagado%') AS total;
            `);
            res.status(200).json({ total: rows[0].total || 0 });
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    getAllEntradas: async (req, res) => {
        try {
            const [rows] = await promisePool.query('SELECT * FROM u154726602_equipos.entrada');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: `Error en la base de datos: ${error.message}` });
        }
    },
    updateEstado: async (req, res) => {
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
    },
    cerrarMes: async (req, res) => {
        const { mes } = req.body;

        try {
            // Iniciar transacción
            await promisePool.query('START TRANSACTION');

            // 1. Copiar datos a historial
            const queryCopiar = `
            INSERT INTO historial (idfacturacion, fecha, monto, observacion, mes)
            SELECT idfacturacion, fecha, monto, observacion, ? 
            FROM facturacion
        `;
            await promisePool.query(queryCopiar, [mes]);

            // 2. Vaciar tabla facturacion
            await promisePool.query('TRUNCATE TABLE facturacion');

            // Confirmar transacción
            await promisePool.query('COMMIT');

            res.status(200).json({ success: true, message: 'Mes cerrado correctamente' });
        } catch (error) {
            // Revertir en caso de error
            await promisePool.query('ROLLBACK');
            console.error('Error al cerrar mes:', error);
            res.status(500).json({ success: false, message: 'Error al cerrar el mes' });
        }
    },
    cerrarCaja: async (req, res) => {
        const { mes } = req.body;
        try {
            // Iniciar transacción
            await promisePool.query('START TRANSACTION');
    
            // 1. Obtener el total de caja
            const [totalRows] = await promisePool.query(`
                SELECT 
                    (SELECT COALESCE(SUM(monto), 0) FROM entrada) -
                    (SELECT COALESCE(SUM(monto), 0) FROM facturacion WHERE estado LIKE '%pagado%') AS total
            `);
            const totalCaja = totalRows[0].total || 0;
    
            // 2. Copiar datos a historial
            const queryCopiar = `
                INSERT INTO historialCaja (fecha, monto)
                SELECT fecha, monto
                FROM entrada;
            `;
            await promisePool.query(queryCopiar, [totalCaja]);
    
            // 3. Vaciar tabla entrada
            await promisePool.query('TRUNCATE TABLE entrada');
    
            // 4. Insertar el total como nuevo registro en entrada (si es necesario)
            // Esto depende de tus requisitos, aquí un ejemplo:
            await promisePool.query(`
                INSERT INTO entrada (fecha, monto)
                VALUES (NOW(), ?)
            `, [totalCaja]);
            await promisePool.query('START TRANSACTION');

            // 1. Copiar datos a historial
            const queryCopiarenHistorial = `
            INSERT INTO historial (idfacturacion, fecha, monto, observacion, mes)
            SELECT idfacturacion, fecha, monto, observacion, ? 
            FROM facturacion
        `;
            await promisePool.query(queryCopiarenHistorial, [mes]);

            // 2. Vaciar tabla facturacion
            await promisePool.query('TRUNCATE TABLE facturacion');

            // Confirmar transacción
            await promisePool.query('COMMIT');
    
            res.status(200).json({ 
                success: true, 
                message: 'Caja cerrada correctamente',
                totalCaja: totalCaja
            });
        } catch (error) {
            // Revertir en caso de error
            await promisePool.query('ROLLBACK');
            console.error('Error al cerrar caja:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar la caja',
                error: error.message 
            });
        }
    }
};


    module.exports = facturacionController;