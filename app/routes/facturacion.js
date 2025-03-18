const express = require('express');
const router = express.Router();
const facturacionController = require('../controllers/facturacionController');

router.post('/getAll', facturacionController.getAll);
router.post('/insert', facturacionController.insert);
router.post('/update', facturacionController.update);
router.post('/delete', facturacionController.delete);
router.post('/totalPagado', facturacionController.totalPagado);
router.post('/totalPendiente', facturacionController.totalPendiente);
router.post('/updateEstado', facturacionController.updateEstado);

module.exports = router;