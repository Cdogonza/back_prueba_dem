const express = require('express');
const cors = require('cors'); // Importa el módulo cors
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authroutes');
const equposRoutes = require('./routes/equipos');
const novedadesRoutes = require('./routes/novedades');
const tallerRoutes = require('./routes/taller');
const mantenmientos = require('./routes/mantenimientos');
const e = require('express');

const port = process.env.PORT || 3000;
dotenv.config();
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permitir todas las orígenes
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors({
    origin: ['http://localhost:4200','https://gold-porpoise-471965.hostingersite.com'], // Permitir solicitudes desde este origen
    methods: 'GET,POST', // Métodos permitidos
    credentials: true // Permitir credenciales si es necesario
}));

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
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

app.use('/equipos', equposRoutes);
app.use('/novedades', novedadesRoutes);
app.use('/taller', tallerRoutes);
app.use('/auth', authRoutes);
app.use('/mantenimientos', mantenmientos);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});