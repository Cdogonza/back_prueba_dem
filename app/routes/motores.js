const express = require('express');
const router = express.Router();
const motoresController = require('../controllers/motoresController');

// Obtener todos los motores
router.get('/', motoresController.getAllMotores);

// Crear un nuevo motor
router.post('/', motoresController.createMotor);

// Buscar motores por criterios
router.get('/search', motoresController.searchMotores);


// Obtener un motor por ID
router.get('/:id', motoresController.getMotorById);

// Actualizar un motor
router.put('/:id', motoresController.updateMotor);

// Eliminar un motor
router.delete('/:id', motoresController.deleteMotor);

module.exports = router; 