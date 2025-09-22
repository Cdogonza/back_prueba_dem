const express = require('express');
const router = express.Router();
const equipamiento_equiposController = require('../controllers/equipamiento_equiposController.js');

router.get('/todos', equipamiento_equiposController.getAllEquipamiento_equipos);

// Nueva ruta para obtener equipos por id_equipamiento
router.get('/:id_equipamiento', equipamiento_equiposController.getEquipamiento_equiposById);

router.post('/', equipamiento_equiposController.createEquipamiento_equipos);
router.put('/:id_equipamiento', equipamiento_equiposController.updateEquipamiento_equipos);
router.delete('/:id', equipamiento_equiposController.deleteEquipamiento_equipos);

// Rutas para anexos de equipamiento
router.post('/anexo/:id_compra', equipamiento_equiposController.uploadAnexo);
router.get('/anexo/:id_compra', equipamiento_equiposController.getAnexosByCompra);
router.get('/anexo/abrir/:id_anexo', equipamiento_equiposController.abrirAnexo);
router.get('/anexo/imagen/:id_anexo', equipamiento_equiposController.servirImagen);
router.get('/anexo/servir/:id_anexo', equipamiento_equiposController.servirArchivo);
router.get('/anexo/download/:id_anexo', equipamiento_equiposController.downloadAnexo);
router.post('/anexo/ejecutar-comando', equipamiento_equiposController.ejecutarComando);
router.delete('/anexo/:id_anexo', equipamiento_equiposController.deleteAnexo);

module.exports = router;