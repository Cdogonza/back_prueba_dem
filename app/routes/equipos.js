const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');

// Obtener todos los equipos
router.get('/', equiposController.getAllEquipos);

// Crear un nuevo equipo
router.post('/', equiposController.createEquipo);

// Obtener un equipo por ID
router.get('/:id', equiposController.getEquipoById);

// Actualizar un equipo
router.put('/:id', equiposController.updateEquipo);

// Eliminar un equipo
router.delete('/:id', equiposController.deleteEquipo);



module.exports = router;