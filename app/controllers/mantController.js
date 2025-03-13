const db = require('../db.js'); // Importar conexión a la base de datos

// Obtener todos los equipos
exports.getAllmentenimientos = async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM u154726602_equipos.mantenimientos');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los equipos', details: err.message });
    }
};

exports.getMantenimientoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'IDD inválido' });
        }

        const [results] = await db.promise().query('SELECT * FROM u154726602_equipos.mantenimientos WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        res.json({ mantenimiento: results[0] });
    } catch (err) {
        console.error(err); // Registrar el error para diagnóstico
        res.status(500).json({ error: 'Error al obtener el mantenimiento', details: err.message });
    }
};

exports.updateMantenimientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, empresa, numero,desde,hasta } = req.body; // Asegúrate de que estos campos existan en tu base de datos

        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        // Validar que se proporcionen los datos necesarios para la actualización
        if (!nombre || !empresa || !numero || !desde || !hasta) {
            return res.status(400).json({ message: 'Faltan datos para actualizar el procedimiento' });
        }

        // Verificar si el mantenimiento existe antes de intentar actualizarlo
        const [results] = await db.promise().query('SELECT * FROM u154726602_equipos.mantenimientos WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Procedimiento no encontrado' });
        }

        // Realizar la actualización
        await db.promise().query('UPDATE u154726602_equipos.mantenimientos SET nombre = ?, empresa = ?, numero = ?, desde = ?,hasta = ? WHERE id = ?', [nombre, empresa, numero,desde,hasta, id]);

        // Responder con un mensaje de éxito
        res.json({ message: 'Procedimiento actualizado correctamente' });
    } catch (err) {
        console.error(err); // Registrar el error para diagnóstico
        res.status(500).json({ error: 'Error al actualizar el mantenimiento', details: err.message });
    }
};


exports.deleteMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.promise().query('DELETE FROM u154726602_equipos.mantenimientos WHERE id = ?', [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Procedimiento no encontrado' });
        }
        res.json({ message: 'Procedimiento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el equipo', details: err.message });
    }
};

exports.getMantenimientosBeforeDate = async (req, res) => {
    try {
        const { hasta } = req.params; // Obtener la fecha de los parámetros de la ruta
        console.log('Fecha recibida:', hasta); // Para depuración

        // Validar que la fecha sea una cadena válida
        if (!hasta || isNaN(Date.parse(hasta))) {
            return res.status(400).json({ message: 'Fecha inválida' });
        }

        // Realizar la consulta para obtener mantenimientos con fecha menor a la proporcionada
        const [results] = await db.promise().query('SELECT * FROM u154726602_equipos.mantenimientos WHERE hasta < ?', [hasta]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron mantenimientos antes de la fecha proporcionada' });
        }

        res.json({ mantenimientos: results });
    } catch (err) {
        console.error(err); // Registrar el error para diagnóstico
        res.status(500).json({ error: 'Error al obtener los mantenimientos', details: err.message });
    }
};
