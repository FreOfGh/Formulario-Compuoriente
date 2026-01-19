const express = require('express');
const cors = require('cors');
require('dotenv').config();
const inscriptionRoutes = require('./src/routes/inscriptionRoutes');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());

// Aumentamos límites para soportar los adjuntos (Cédula, RUT, etc.)
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- RUTAS ---
app.use('/api/inscripciones', inscriptionRoutes);

// Ruta raíz para probar directamente en el navegador
app.get('/', (req, res) => res.send('API de Inscripciones CompuOriente activa 🚀'));
app.get('/health', (req, res) => res.status(200).send('OK ✅'));

const PORT = process.env.PORT || 3001;

// --- CORRECCIÓN CRÍTICA PARA RAILWAY ---
// Se añade '0.0.0.0' para permitir conexiones externas
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Modular Operativo en puerto ${PORT}`);
    console.log(`🌍 URL Pública: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Ver en panel de Railway'}`);
});