const db = require('../db.js'); // Importar conexión a la base de datos

const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";
// Obtener todo el equipamiento
exports.getAllEquipamiento = async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM ${url_base}.equipamiento`);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el equipamiento', details: err.message });
    }
};

// Crear un nuevo equipamiento
exports.createEquipamiento = async (req, res) => {
    try {
        const nuevoEquipamiento = req.body;
        if (!nuevoEquipamiento || Object.keys(nuevoEquipamiento).length === 0) {
            return res.status(400).json({ message: 'Los datos del equipamiento son requeridos' });
        }

        const [results] = await db.query(`INSERT INTO ${url_base}.equipamiento SET ?`, [nuevoEquipamiento]);
        res.status(201).json({ id: results.insertId, ...nuevoEquipamiento });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el equipamiento', details: err.message });
    }
};

// Obtener un equipamiento por ID
exports.getEquipamientoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const [results] = await db.query(`SELECT * FROM ${url_base}.equipamiento WHERE id = ?`, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Equipamiento no encontrado' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el equipamiento', details: err.message });
    }
};

// Actualizar un equipamiento
exports.updateEquipamiento = async (req, res) => {
    try {
        const { id } = req.params;
        const equipamientoActualizado = req.body;

        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        if (!equipamientoActualizado || Object.keys(equipamientoActualizado).length === 0) {
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos' });
        }

        const [results] = await db.query(`UPDATE ${url_base}.equipamiento SET ? WHERE id = ?`, [equipamientoActualizado, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipamiento no encontrado' });
        }

        res.json({ message: 'Equipamiento actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el equipamiento', details: err.message });
    }
};

// Eliminar un equipamiento
exports.deleteEquipamiento = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const [results] = await db.query(`DELETE FROM ${url_base}.equipamiento WHERE id = ?`, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipamiento no encontrado' });
        }

        res.json({ message: 'Equipamiento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el equipamiento', details: err.message });
    }
};

// Buscar equipamiento por criterios específicos
exports.searchEquipamiento = async (req, res) => {
    try {
        const { tipo, estado, ubicacion, trimestre } = req.query;
        let query = `SELECT * FROM ${url_base}.equipamiento WHERE 1=1`;
        const params = [];

        if (tipo) {
            query += ' AND tipo LIKE ?';
            params.push(`%${tipo}%`);
        }

        if (estado) {
            query += ' AND estado LIKE ?';
            params.push(`%${estado}%`);
        }

        if (ubicacion) {
            query += ' AND ubicacion LIKE ?';
            params.push(`%${ubicacion}%`);
        }

        if (trimestre) {
            query += ' AND trimestre = ?';
            params.push(trimestre);
        }

        const [results] = await db.query(query, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar equipamiento', details: err.message });
    }
};

// Obtener equipamiento por trimestre específico
exports.getEquipamientoByTrimestre = async (req, res) => {
    try {
        const { trimestre } = req.params;
        
        // Validar que el trimestre es válido (primero, segundo, tercer, cuarto)
        const trimestresValidos = ['primer', 'segundo', 'tercer', 'cuarto'];
        if (!trimestre || !trimestresValidos.includes(trimestre)) {
            return res.status(400).json({ 
                message: 'Trimestre inválido. Debe ser: primero, segundo, tercer o cuarto',
                trimestres_validos: trimestresValidos
            });
        }

        const [results] = await db.query(
            `SELECT * FROM ${url_base}.equipamiento WHERE trimestre = ? ORDER BY id`,
            [trimestre]
        );

        if (results.length === 0) {
            return res.status(404).json({ message: `No se encontró equipamiento para el trimestre ${trimestre}` });
        }

        res.json({
            trimestre: trimestre,
            total_equipos: results.length,
            equipamiento: results
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener equipamiento por trimestre', details: err.message });
    }
}; 