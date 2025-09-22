//NOVEDADES
const db = require('../db.js'); // Asegúrate de crear un archivo db.js para manejar la conexión

const url_base = process.env.NODE_ENV === 'development' ? "u154726602_equipos_test" : "u154726602_equipos";

const documentosController = {

    // Obtener todos los documentos
    getAllDocumentos: async (req, res) => {
        try {
            // Usar await para manejar la promesa
            const [results] = await db.query(`SELECT * FROM ${url_base}.documentos ORDER BY fecha DESC`);

            // Si no hay resultados
            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron documentos.' });
            }

            // Respuesta exitosa
            res.json(results);
        } catch (err) {
            console.error('Error en getAllDocumentos:', err);

            // Respuesta de error
            // Respuesta de error
            res.status(500).json({
                error: 'Error en el servidor',
                details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
            });
        }
    },
    getDocumentosHoy : async (req, res) => {
        try {
    
            const [results] = await db.query(`
SELECT * 
FROM ${url_base}.documentos 
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
    createDocumentos : async (req, res) => {
        try {
            const hoy = obtenerFechaHoy();
            const {  nombre, documento, matricula, procedencia, asunto, seccion } = req.body;
            const query = `INSERT INTO ${url_base}.documentos (fecha, nombre, documento, matricula, procedencia, asunto, seccion) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [hoy, nombre, documento, matricula, procedencia, asunto, seccion];

            // Usar await para manejar la promesa
            const [result] = await db.query(query, values);

            // Respuesta exitosa
            res.status(201).json({ message: 'Documento creado exitosamente'});
        } catch (err) {
            console.error('Error en createDocumentos:', err);

            // Respuesta de error
            res.status(500).json({
                error: 'Error en el servidor',
                details: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
            });
        }
    }
};
module.exports = documentosController;
function obtenerFechaHoy() {
    const today = new Date();
    today.setDate(today.getDate());
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}