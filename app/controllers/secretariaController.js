
const db = require('../db'); // Asegúrate de crear un archivo db.js para manejar la conexión

const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";
const secretariaController = {
    // Obtener todos los talleres
    getAllTaller: async (req, res) => {
        try {
            // Usar await para manejar la promesa
            const [results] = await db.query(`SELECT * FROM ${url_base}.taller ORDER BY fecha DESC`);

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
    getTallerbyId: async (req, res) => {
        const id = req.body.id; // Cambiado a req.body.id para obtener el ID del cuerpo de la solicitud
        try {   
            const [results] = await db.query(`SELECT * FROM ${url_base}.equipos WHERE dem = ?`, [id]);
            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontró el taller.' });
            }
            res.json(results[0]);
        } catch (err) {
            console.error('Error en getTallerbyId:', err);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}
module.exports = secretariaController;
    // Obtener todas las novedades de hoy
