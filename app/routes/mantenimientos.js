const express = require('express');
const router = express.Router();
const mantController = require('../controllers/mantController');

// Obtener todos los equipos
router.get('/', mantController.getAllmentenimientos);

// Crear un nuevo equipo
// router.post('/', equiposController.createEquipo);

// Obtener un equipo por ID
router.get('/:id', mantController.getMantenimientoById);

// Actualizar un equipo
router.put('/:id', mantController.updateMantenimientoById);

// Eliminar un equipo
router.delete('/:id', mantController.deleteMantenimiento);

router.get('/fecha/:hasta', mantController.getMantenimientosBeforeDate);

router.get('/meses/:hasta', mantController.getMantenimientosBeforeDate);

module.exports = router;