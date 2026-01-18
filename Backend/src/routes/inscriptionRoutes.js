const express = require('express');
const router = express.Router();
const multer = require('multer');
const inscriptionController = require('../controllers/inscriptionController');

// Configuración de subida temporal
const upload = multer({ dest: '../../tmp' });

// Definir el endpoint POST
router.post('/register', upload.fields([
    { name: 'docIdentidad' }, 
    { name: 'foto' }, 
    { name: 'certificado' }, 
    { name: 'rut' }
]), inscriptionController.registerInscripcion);

module.exports = router;