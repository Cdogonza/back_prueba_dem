//const mysql = require('mysql2');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise'); 
// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear el pool de conexiones
const promisePool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Límite de conexiones simultáneas
    queueLimit: 0 // No limitar la cantidad de consultas en cola
});

// Mantener la conexión activa
const keepAliveInterval = setInterval(async () => {
    try {
        // Ejecutar una consulta simple para mantener la conexión activa
        const [results] = await promisePool.query('SELECT 1');
        console.log('Conexión a la base de datos activa:', results);
    } catch (err) {
        console.error('Error manteniendo la conexión:', err);

        // Detener el intervalo si hay un error crítico
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            console.error('Conexión perdida. Deteniendo el intervalo...');
            clearInterval(keepAliveInterval);
        }
    }
}, 100000); // 300,000 ms = 5 minutos

// Exportar el pool para usarlo en otros archivos
module.exports = promisePool;
