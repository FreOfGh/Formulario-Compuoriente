const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const inscriptionController = require('../controllers/inscriptionController');

/**
 * CONFIGURACIÓN DE ALMACENAMIENTO (Multer)
 * Se encarga de conservar la extensión original para que los archivos
 * sean legibles durante el proceso de generación del PDF.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        // Crear la carpeta si no existe para evitar errores
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Genera un nombre único: campo-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Inicializar multer con la configuración de storage
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite opcional de 5MB por archivo
});

/**
 * DEFINICIÓN DE LA RUTA
 * Usamos upload.fields para capturar múltiples archivos con diferentes nombres de campo.
 */
router.post(
    '/register', 
    upload.fields([
        { name: 'docIdentidad', maxCount: 1 },
        { name: 'foto', maxCount: 1 },
        { name: 'certificado', maxCount: 1 },
        { name: 'diploma', maxCount: 1 },
        { name: 'rut', maxCount: 1 }
    ]), 
    inscriptionController.registerInscripcion
);

module.exports = router;