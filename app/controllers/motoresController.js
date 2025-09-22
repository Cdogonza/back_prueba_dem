const db = require('../db.js'); // Importar conexión a la base de datos
const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";
// Obtener todos los motores
exports.getAllMotores = async (req, res) => {
    try {
        const [results] = await db.query(`SELECT * FROM ${url_base}.motores`);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los motores', details: err.message });
    }
};

// Crear un nuevo motor
exports.createMotor = async (req, res) => {
    try {
        const nuevoMotor = req.body;
        if (!nuevoMotor || Object.keys(nuevoMotor).length === 0) {
            return res.status(400).json({ message: 'Los datos del motor son requeridos' });
        }

        const [results] = await db.query(`INSERT INTO ${url_base}.motores SET ?`, [nuevoMotor]);
        res.status(201).json({ id: results.insertId, ...nuevoMotor });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el motor', details: err.message });
    }
};

// Obtener un motor por ID
exports.getMotorById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const [results] = await db.query(`SELECT * FROM ${url_base}.motores WHERE id = ?`, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Motor no encontrado' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el motor', details: err.message });
    }
};

// Actualizar un motor
exports.updateMotor = async (req, res) => {
    try {
        const { id } = req.params;
        const motorActualizado = req.body;

        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        if (!motorActualizado || Object.keys(motorActualizado).length === 0) {
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos' });
        }

        const [results] = await db.query(`UPDATE ${url_base}.motores SET ? WHERE id = ?`, [motorActualizado, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Motor no encontrado' });
        }

        res.json({ message: 'Motor actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el motor', details: err.message });
    }
};

// Eliminar un motor
exports.deleteMotor = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID es un número
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const [results] = await db.query(`DELETE FROM ${url_base}.motores WHERE id = ?`, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Motor no encontrado' });
        }

        res.json({ message: 'Motor eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el motor', details: err.message });
    }
};

// Buscar motores por criterios específicos
exports.searchMotores = async (req, res) => {
    try {
        const { tipo, potencia, estado, fabricante } = req.query;
        let query = `SELECT * FROM ${url_base}.motores WHERE 1=1`;
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
        res.status(500).json({ error: 'Error al buscar motores', details: err.message });
    }
};

