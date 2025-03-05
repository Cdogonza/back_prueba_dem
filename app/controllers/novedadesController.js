//NOVEDADES
const db = require('../db.js'); // Asegúrate de crear un archivo db.js para manejar la conexión
const moment = require('moment');
// Obtener todos las novedades
exports.getAllNovedades = (req, res) => {
    db.query('SELECT * FROM u154726602_equipos.novedades ORDER BY fecha DESC', (err, results) => {
        if (err) return res.status(500).json(err.cause);
        res.json(results);
    });
};

function obtenerFechaHoy() {
    const today = new Date();
    today.setDate(today.getDate() - 2);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function obtenerFechaAyer() {
    const today = new Date();
    // Restar un día
    today.setDate(today.getDate() - 3);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

exports.getNovedadesHoy = (req, res) => {
    const ayer = obtenerFechaAyer();
    const hoy = obtenerFechaHoy();
    const query = `
        SELECT * FROM u154726602_equipos.novedades 
        WHERE fecha > ? AND fecha <= ?
        ORDER BY fecha DESC
    `;

    db.query(query, [ayer, hoy], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);

    });
};
exports.createNovedad = (req, res) => {
    const hoy = obtenerFechaHoy();
   
    const { nombre, novedad } = req.body;

    // Validar los datos
    if (!nombre || !novedad) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const query = 'INSERT INTO u154726602_equipos.novedades (fecha, nombre, novedad) VALUES (?, ?, ?)';
    db.query(query, [hoy, nombre, novedad], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Novedad creada exitosamente', id: results.insertId });
    });
};