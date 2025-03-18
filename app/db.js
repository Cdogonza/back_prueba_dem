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
// setInterval(() => {
//     promisePool.query('SELECT 1', (err, results) => {
//         if (err) {
//             console.error('Error manteniendo la conexión:', err);
//         }
        
//     });
// }, 1000); // Cada 5 segundos

// Exportar el pool para usarlo en otros archivos
module.exports = promisePool;
