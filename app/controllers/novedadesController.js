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
exports.getNovedadesHoy = (req, res) => {
    const ff = new Date().toISOString().split('T')[0]; // yyyy-MM-DD;
    const hoy = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const ayer = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');

    const query = `
        SELECT * FROM u154726602_equipos.novedades 
        WHERE fecha >= ? AND fecha < ?
        ORDER BY fecha DESC
    `;

    db.query(query, [ayer, ff], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);

    });
};
exports.createNovedad = (req, res) => {
    const hoy = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    console.log(hoy);
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