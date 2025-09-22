const db = require('../db.js'); // Importar conexión a la base de datos
const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";
// Obtener todos los mantenimientos
exports.getAllMantenimientos = async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM ${url_base}.mantenimiento`);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los mantenimientos', details: err.message });
    }
};

// Crear un nuevo mantenimiento
exports.createMantenimiento = async (req, res) => {
    try {
        const nuevoMantenimiento = req.body;
        if (!nuevoMantenimiento || Object.keys(nuevoMantenimiento).length === 0) {
            return res.status(400).json({ message: 'Los datos del mantenimiento son requeridos' });
        }

        const [results] = await db.query(`INSERT INTO ${url_base}.mantenimiento SET ?`, [nuevoMantenimiento]);
        res.status(201).json({ id: results.insertId, ...nuevoMantenimiento });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el mantenimiento', details: err.message });
    }
};

// Obtener un mantenimiento por ID
exports.getMantenimientoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const [results] = await db.query(`SELECT * FROM ${url_base}.mantenimiento WHERE id = ?`, [id]);

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

        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        if (!mantenimientoActualizado || Object.keys(mantenimientoActualizado).length === 0) {
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos' });
        }

        const [results] = await db.query(`UPDATE ${url_base}.mantenimiento SET ? WHERE id = ?`, [mantenimientoActualizado, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        res.json({ message: 'Mantenimiento actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el mantenimiento', details: err.message });
    }
};

// Eliminar un mantenimiento
exports.deleteMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const [results] = await db.query(`DELETE FROM ${url_base}.mantenimiento WHERE id = ?`, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Mantenimiento no encontrado' });
        }

        res.json({ message: 'Mantenimiento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el mantenimiento', details: err.message });
    }
};

// Buscar mantenimientos por criterios específicos
exports.searchMantenimientos = async (req, res) => {
    try {
        const { tipo, estado, equipo_id, fecha_inicio, fecha_fin } = req.query;
        let query = `SELECT * FROM ${url_base}.mantenimiento WHERE 1=1`;
        const params = [];

        if (tipo) {
            query += ' AND funcionario LIKE ?';
            params.push(`%${funcionario}%`);
        }

        if (potencia) {
            query += ' AND nro_compra LIKE ?';
            params.push(`%${nro_compra}%`);
        }

        if (estado) {
            query += ' AND trimestre LIKE ?';
            params.push(`%${trimestre}%`);
        }

        if (fabricante) {
            query += ' AND servicio LIKE ?';
            params.push(`%${servicio}%`);
        }

        const [results] = await db.query(query, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar mantenimientos', details: err.message });
    }
};



