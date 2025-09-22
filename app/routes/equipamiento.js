const express = require('express');
const router = express.Router();
const equipamientoController = require('../controllers/equipamientoController');

// Obtener todo el equipamiento
router.get('/', equipamientoController.getAllEquipamiento);

// Crear un nuevo equipamiento
router.post('/', equipamientoController.createEquipamiento);

// Buscar equipamiento por criterios
router.get('/search', equipamientoController.searchEquipamiento);

// Obtener equipamiento por trimestre
router.get('/trimestre/:trimestre', equipamientoController.getEquipamientoByTrimestre);

// Obtener un equipamiento por ID
router.get('/:id', equipamientoController.getEquipamientoById);

// Actualizar un equipamiento
router.put('/:id', equipamientoController.updateEquipamiento);

// Eliminar un equipamiento
router.delete('/:id', equipamientoController.deleteEquipamiento);

module.exports = router; 