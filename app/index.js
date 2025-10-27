const express = require('express');
const cors = require('cors'); // Importa el módulo cors
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authroutes');
const equposRoutes = require('./routes/equipos');
const novedadesRoutes = require('./routes/novedades');
const facturacion = require('./routes/facturacion');
const secretaria = require('./routes/secretaria');
const documentos = require('./routes/documentos');
const equipamientoRoutes = require('./routes/equipamiento');
const motoresRoutes = require('./routes/motores');

const equipamiento_equiposRoutes = require('./routes/equipamiento_equiposRoutes');
const mantenimientosRoutes = require('./routes/mantenimientos');
const informes_tecnicosRoutes = require('./routes/informes_tecnicosRoutes');

const e = require('express');

const port = process.env.PORT || 3001;
dotenv.config();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permitir todas las orígenes
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors({
    origin: ['http://localhost:4200','http://10.50.50.50'], // Permitir solicitudes desde este origen
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS', // Métodos permitidos
    credentials: true // Permitir credenciales si es necesario
}));

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", 
      "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self';");
    next();
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

app.use('/api/equipos', equposRoutes);
app.use('/api/novedades', novedadesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/facturacion', facturacion);
app.use('/api/secretaria',secretaria);
app.use('/api/documentos', documentos);
app.use('/api/equipamiento', equipamientoRoutes);
app.use('/api/motores', motoresRoutes);
app.use('/api/equipamiento_equipos', equipamiento_equiposRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);
app.use('/api/informes_tecnicos', informes_tecnicosRoutes);

// Ruta de prueba al final para evitar conflictos
app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.listen(port,'0.0.0.0', () => {
    console.log('Backend escuchando en http://0.0.0.0:3001');
});
//172.18.21.%