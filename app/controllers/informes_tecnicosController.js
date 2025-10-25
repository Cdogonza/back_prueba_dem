const db = require('../db.js'); // Importar conexión a la base de datos
const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";
// Obtener todos los informes técnicos
exports.getAllInformesTecnicos = async (req, res) => {
    try {
        // Ordenar por estado: primero sin asignar (null), luego en proceso, y por último completados
        const [results] = await db.query(`
            SELECT * FROM ${url_base}.informes_tecnicos 
            ORDER BY 
                CASE 
                    WHEN informes_tecnicos_estado = 'sin asignar' THEN 1
                    WHEN informes_tecnicos_estado = 'en proceso' THEN 2
                    WHEN informes_tecnicos_estado = 'completado' THEN 3
                    ELSE 4
                END,
                idinformes_tecnicos DESC
        `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los informes técnicos', details: err.message });
    }
};

// Crear un nuevo informe técnico
exports.createInformeTecnico = async (req, res) => {
    try {
        const nuevoInforme = req.body;
        if (!nuevoInforme || Object.keys(nuevoInforme).length === 0) {
            return res.status(400).json({ message: 'Los datos del informe técnico son requeridos' });
        }

        // Validar campos requeridos
        const { 
            informes_tecnicos_fecha_recibido, 
            informes_tecnicos_tipo_compra, 
            informes_tecnicos_nro, 
            informes_tecnicos_todo, 
            informes_tecnicos_detalles,
            informes_tecnicos_estado,
            informes_tecnicos_tecnico
        } = nuevoInforme;
        
        if (!informes_tecnicos_fecha_recibido || !informes_tecnicos_tipo_compra || !informes_tecnicos_nro) {
            return res.status(400).json({ message: 'Los campos fecha_recibido, tipo_compra y nro son requeridos' });
        }
        
        // Los campos informes_tecnicos_estado e informes_tecnicos_tecnico son opcionales y pueden ser null

        const [results] = await db.query(`INSERT INTO ${url_base}.informes_tecnicos SET ?`, [nuevoInforme]);
        res.status(201).json({ id: results.insertId, ...nuevoInforme });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el informe técnico', details: err.message });
    }
};

// Obtener un informe técnico por ID
exports.getInformeTecnicoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query(`SELECT * FROM ${url_base}.informes_tecnicos WHERE idinformes_tecnicos = ?`, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Informe técnico no encontrado' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el informe técnico', details: err.message });
    }
};

// Actualizar un informe técnico
exports.updateInformeTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        const informeActualizado = req.body;

        if (!informeActualizado || Object.keys(informeActualizado).length === 0) {
            return res.status(400).json({ message: 'Los datos para actualizar son requeridos' });
        }
        
        // El campo informes_tecnicos_fecha_recibido NO se puede modificar una vez creado
        // Removemos este campo del objeto de actualización si está presente
        delete informeActualizado.informes_tecnicos_fecha_recibido;
        
        // Los campos informes_tecnicos_estado e informes_tecnicos_tecnico pueden ser null en las actualizaciones

        const [results] = await db.query(`UPDATE ${url_base}.informes_tecnicos SET ? WHERE idinformes_tecnicos = ?`, [informeActualizado, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Informe técnico no encontrado' });
        }

        res.json({ message: 'Informe técnico actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el informe técnico', details: err.message });
    }
};

// Eliminar un informe técnico
exports.deleteInformeTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query(`DELETE FROM ${url_base}.informes_tecnicos WHERE idinformes_tecnicos = ?`, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Informe técnico no encontrado' });
        }

        res.json({ message: 'Informe técnico eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el informe técnico', details: err.message });
    }
};
