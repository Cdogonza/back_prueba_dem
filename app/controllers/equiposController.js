const db = require('../db.js'); // Importar conexión a la base de datos

// Obtener todos los equipos
exports.getAllEquipos = async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM u154726602_equipos.equipos');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los equipos', details: err.message });
    }
};

// Crear un nuevo equipo
exports.createEquipo = async (req, res) => {
    try {
        const nuevoEquipo = req.body;
        if (!nuevoEquipo || Object.keys(nuevoEquipo).length === 0) {
            return res.status(400).json({ message: 'Los datos del equipo son requeridos' });
        }

        const [results] = await db.promise().query('INSERT INTO u154726602_equipos.equipos SET ?', [nuevoEquipo]);
        res.status(201).json({ id: results.insertId, ...nuevoEquipo });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el equipo', details: err.message });
    }
};

// Obtener un equipo por ID
exports.getEquipoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.promise().query('SELECT * FROM u154726602_equipos.equipos WHERE dem = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el equipo', details: err.message });
    }
};

// Actualizar un equipo
exports.updateEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const equipoActualizado = req.body;

        if (!equipoActualizado || Object.keys(equipoActualizado).length === 0) {
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos' });
        }

        const [results] = await db.promise().query('UPDATE u154726602_equipos.equipos SET ? WHERE dem = ?', [equipoActualizado, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        res.json({ message: 'Equipo actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el equipo', details: err.message });
    }
};

// Eliminar un equipo
exports.deleteEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.promise().query('DELETE FROM u154726602_equipos.equipos WHERE dem = ?', [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        res.json({ message: 'Equipo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el equipo', details: err.message });
    }
};
