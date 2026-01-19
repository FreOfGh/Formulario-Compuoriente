const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno
const inscriptionRoutes = require('./src/routes/inscriptionRoutes');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());

// Aumentamos el límite a 10mb para que soporte el envío de imágenes/documentos
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- RUTAS ---
app.use('/api/inscripciones', inscriptionRoutes);

// Ruta de prueba para verificar que el servidor responde
app.get('/health', (req, res) => res.send('Servidor funcionando ✅'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Modular Operativo en puerto ${PORT}`);
    console.log(`✅ Base de datos conectada en: ${process.env.DB_HOST || 'LOCALHOST'}`);
});