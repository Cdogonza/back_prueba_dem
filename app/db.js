const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear el pool de conexiones
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Límite de conexiones simultáneas
    queueLimit: 0 // No limitar la cantidad de consultas en cola
});

// Mantener la conexión activa
setInterval(() => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Error manteniendo la conexión:', err);
        }
        // Aquí no necesitas hacer nada con los resultados
    });
}, 1000); // Cada 5 segundos

// Exportar el pool para usarlo en otros archivos
module.exports = db;
