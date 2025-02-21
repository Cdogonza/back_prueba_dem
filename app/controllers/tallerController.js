const db = require('../db'); // Asegúrate de crear un archivo db.js para manejar la conexión


// Obtener todos los equipos
exports.getAllTaller = (req, res) => {
    db.query('SELECT t.*, e.nombre AS nombre_equipo FROM u154726602_equipos.taller t JOIN u154726602_equipos.equipos e ON t.dem = e.dem;', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Crear un nuevo equipo
exports.createTaller= (req, res) => {
    const nuevoEquipo = req.body;
    db.query('INSERT INTO u154726602_equipos.taller SET ?', nuevoEquipo, (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: results.insertId, ...nuevoEquipo });
    });
};