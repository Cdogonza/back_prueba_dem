const express = require('express');
const router = express.Router();
const informesTecnicosController = require('../controllers/informes_tecnicosController');

// Obtener todos los informes técnicos
router.get('/', informesTecnicosController.getAllInformesTecnicos);

// Crear un nuevo informe técnico
router.post('/', informesTecnicosController.createInformeTecnico);

// Obtener un informe técnico por ID
router.get('/:id', informesTecnicosController.getInformeTecnicoById);

// Actualizar un informe técnico
router.put('/:id', informesTecnicosController.updateInformeTecnico);

// Eliminar un informe técnico
router.delete('/:id', informesTecnicosController.deleteInformeTecnico);

module.exports = router;
