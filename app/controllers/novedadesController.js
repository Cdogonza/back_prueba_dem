//NOVEDADES
const db = require('../db.js'); // Asegúrate de crear un archivo db.js para manejar la conexión


const novedadesController = {
    // Obtener todas las novedades
    getAllNovedades: async (req, res) => {
        try {
            // Usar await para manejar la promesa
            const [results] = await db.query('SELECT * FROM u154726602_equipos.novedades ORDER BY fecha DESC');

            // Si no hay resultados
            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron novedades.' });
            }

            // Respuesta exitosa
            res.json(results);
        } catch (err) {
            console.error('Error en getAllNovedades:', err);

            // Respuesta de error
            res.status(500).json({
                error: 'Error en el servidor',
                details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
            });
        }
    },
    getNovedadesHoy : async (req, res) => {
        try {
    
            const [results] = await db.query(`
SELECT * 
FROM u154726602_equipos.novedades 
WHERE fecha >= CURDATE() - INTERVAL 1 DAY 
  AND fecha < CURDATE() + INTERVAL 1 DAY
ORDER BY fecha DESC;
            `);
            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron novedades.' });
            }
            res.json(results);
        } catch (err) {
            console.error('Error en getNovedadesHoy:', err);
            res.status(500).json({
                error: 'Error en el servidor',
                details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
            });
        }
    },
    createNovedad: async (req, res) => {
        try {
            const hoy = obtenerFechaHoy();
            const { nombre, novedad } = req.body;

            // Validar campos requeridos
            if (!nombre || !novedad) {
                return res.status(400).json({ message: 'Todos los campos son requeridos' });
            }

            // Definir la consulta SQL
            const query = 'INSERT INTO u154726602_equipos.novedades (fecha, nombre, novedad) VALUES (?, ?, ?)';

            // Ejecutar la consulta usando promesas
            const [results] = await db.query(query, [hoy, nombre, novedad]);

            // Respuesta exitosa
            res.status(201).json({ message: 'Novedad creada exitosamente', id: results.insertId });
        } catch (err) {
            console.error('Error en createNovedad:', err);

            // Respuesta de error
            res.status(500).json({
                error: 'Error en el servidor',
                details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
            });
        }
    }
};

module.exports = novedadesController;

function obtenerFechaHoy() {
    const today = new Date();
    today.setDate(today.getDate());
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

        

