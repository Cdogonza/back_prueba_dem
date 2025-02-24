const express = require('express');
const router = express.Router();
const tallerController = require('../controllers/tallerController');

// Obtener todos los equipos
router.get('/taller', tallerController.getAllTaller);

// Crear un nuevo equipo
router.post('/taller', tallerController.createTaller);

// // Obtener un equipo por ID
// router.get('/:id', tallerController.getEquipoById);

// // Actualizar un equipo
// router.put('/:id', tallerController.updateEquipo);

// // Eliminar un equipo
// router.delete('/:id', tallerController.deleteEquipo);

module.exports = router;