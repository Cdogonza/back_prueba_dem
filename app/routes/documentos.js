const express = require('express');
const router = express.Router();
const documentosController = require('../controllers/documentosController');

// Obtener todos los equipos
router.get('/todos', documentosController.getAllDocumentos);

router.post('/', documentosController.createDocumentos);

router.get('/hoy', documentosController.getDocumentosHoy);

module.exports = router;