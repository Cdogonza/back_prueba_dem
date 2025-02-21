const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear la conexión a la base de datos
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

setInterval(() => {
    pool.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Error manteniendo la conexión:', err);
        }
        // Aquí no necesitas hacer nada con los resultados
    });
}, 5000); // Cada 5 segundos
// Exportar la conexión para usarla en otros archivos
module.exports = db;