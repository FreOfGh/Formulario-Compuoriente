const db = require('../config/db');
const documentService = require('../services/documentService');
const mailService = require('../services/mailService');

const registerInscripcion = async (req, res) => {
    try {
        const v = req.body;
        
        // 1. Guardar en PostgreSQL
        const query = `
            INSERT INTO inscripciones (
                nombre_completo, tipo_documento, numero_documento, lugar_expedicion, rh,
                fecha_nacimiento, departamento, ciudad, estado_civil, direccion, municipio,
                telefono, eps, correo, nombre_padre, cc_padre, nombre_madre, cc_madre,
                programa_interes, horario
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING id`;
        
        const values = [
            v.nombreCompleto, v.tipoDocumento, v.numeroDocumento, v.expedidaEn, v.rh,
            v.fechaNacimiento, v.id_departamento, v.ciudad, v.estadoCivil, v.direccion, v.municipio,
            v.telefono, v.eps, v.correo, v.nombrePadre, v.ccPadre, v.nombreMadre, v.ccMadre,
            v.programaInteres, v.horario
        ];

        const { rows } = await db.query(query, values);
        const recordId = rows[0].id;

        // 2. Generar el PDF basado en el Word
        const pdfPath = await documentService.generateInscriptionPDF(v, recordId);

        // 3. Enviar correos
        await mailService.sendConfirmationEmails(v, pdfPath);

        res.status(201).json({ status: 'success', message: 'Inscripción completa', id: recordId });
    } catch (error) {
        console.error('Error en controlador:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { registerInscripcion };