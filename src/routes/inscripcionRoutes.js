const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController'); 

router.get('/', inscripcionController.obtenerTodos);
router.post('/', inscripcionController.crear);
router.put('/:id', inscripcionController.actualizar);
router.delete('/:id', inscripcionController.eliminar);

module.exports = router;