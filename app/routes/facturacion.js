const express = require('express');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');

router.post('/getAll', facturacionController.getAll);
router.post('/insert', facturacionController.insert);
router.post('/insertEntrada', facturacionController.insertEntrada);
router.post('/update', facturacionController.update);
router.post('/totalPagado', facturacionController.totalPagado);
router.post('/totalPendiente', facturacionController.totalPendiente);
router.post('/totalEntrada', facturacionController.totalEntrada);
router.post('/totalCaja', facturacionController.totalCaja);
router.post('/updateEstado', facturacionController.updateEstado);
router.delete('/delete/:idfacturacion', facturacionController.delete);

module.exports = router;