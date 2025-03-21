const express = require('express');
const router = express.Router();
const novedadesController = require('../controllers/novedadesController');

// Obtener todos los equipos
router.get('/todas', novedadesController.getAllNovedades);

// Crear un nuevo equipo
router.get('/hoy', novedadesController.getNovedadesHoy);

router.post('/', novedadesController.createNovedad);

module.exports = router;