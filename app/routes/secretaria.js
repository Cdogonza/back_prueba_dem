const express = require('express');
const router = express.Router();
const secretaria = require('../controllers/secretariaController');

// Obtener todos los equipos
router.get('/', secretaria.getAllTaller);

// Crear un nuevo equipo
router.post('/taller', secretaria.getTallerbyId);

// // Obtener un equipo por ID
// router.get('/:id', tallerController.getEquipoById);

// // Actualizar un equipo
// router.put('/:id', tallerController.updateEquipo);

// // Eliminar un equipo
// router.delete('/:id', tallerController.deleteEquipo);

module.exports = router;