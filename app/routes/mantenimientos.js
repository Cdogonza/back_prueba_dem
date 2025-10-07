const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoController');

// Obtener todos los mantenimientos
router.get('/', mantenimientoController.getAllMantenimientos);

// Crear un nuevo mantenimiento
router.post('/', mantenimientoController.createMantenimiento);

// Obtener un mantenimiento por ID
router.get('/:id', mantenimientoController.getMantenimientoById);

// Actualizar un mantenimiento
router.put('/:id', mantenimientoController.updateMantenimiento);

// Eliminar un mantenimiento
router.delete('/:id', mantenimientoController.deleteMantenimiento);

// Obtener mantenimientos por empresa
router.get('/empresa/:empresa', mantenimientoController.getMantenimientosByEmpresa);

// Obtener mantenimientos por rango de fechas
router.get('/fechas/rango', mantenimientoController.getMantenimientosByDateRange);

module.exports = router;
