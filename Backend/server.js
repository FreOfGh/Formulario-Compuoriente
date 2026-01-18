const express = require('express');
const cors = require('cors');
const inscriptionRoutes = require('./src/routes/inscriptionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Usar las rutas modulares
app.use('/api/inscripciones', inscriptionRoutes);

app.listen(process.env.PORT || 3001, () => {
    console.log('Servidor Modular Operativo 🚀');
});