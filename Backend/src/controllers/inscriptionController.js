const db = require('../config/db');
const documentService = require('../services/documentService');
const mailService = require('../services/mailService');
const fs = require('fs');

const registerInscripcion = async (req, res) => {
    try {
        // v contiene los textos (nombre, cédula, etc.)
        const v = req.body;
        // files contiene los archivos físicos (con extensión) subidos por Multer
        const files = req.files || {};

        // 1. Mapeo de booleanos para los checkboxes del PDF (☑ / ☐)
        // Esto le dice al PDF qué casillas marcar en la primera página
        const adjuntosParaCheck = {
            f_cedula: !!files['docIdentidad'] ? '☑' : '☐',
            f_foto: !!files['foto'] ? '☑' : '☐',
            f_cert: !!files['certificado'] ? '☑' : '☐',
            f_diploma: !!files['diploma'] ? '☑' : '☐',
            f_rut: !!files['rut'] ? '☑' : '☐'
        };

        // 2. Guardar datos en PostgreSQL
        const query = `
            INSERT INTO inscripciones (
                nombre_completo, tipo_documento, numero_documento, lugar_expedicion, rh,
                fecha_nacimiento, departamento, ciudad, estado_civil, direccion, municipio,
                telefono, eps, correo, nombre_padre, cc_padre, nombre_madre, cc_madre,
                programa_interes, horario
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            )
            RETURNING id`;
        
        const values = [
            v.nombreCompleto, v.tipoDocumento, v.numeroDocumento, v.expedidaEn, v.rh,
            v.fechaNacimiento, v.id_departamento, v.ciudad, v.estadoCivil, v.direccion, v.municipio,
            v.telefono, v.eps, v.correo, v.nombrePadre, v.ccPadre, v.nombreMadre, v.ccMadre,
            v.programaInteres, v.horario
        ];

        const { rows } = await db.query(query, values);
        const recordId = rows[0].id;

        // 3. Preparar datos para el Servicio de PDF
        // Unimos los textos con los símbolos de los checkboxes
        const dataForPDF = {
            ...v,
            ...adjuntosParaCheck
        };

        // 4. Generar el PDF final (Fusionando el formulario con los archivos adjuntos)
        // Pasamos 'files' como segundo argumento para que pdf-lib los pueda unir
        const pdfPath = await documentService.generateInscriptionPDF(dataForPDF, files);

        // 5. Enviar correos con el PDF fusionado
        await mailService.sendConfirmationEmails(v, pdfPath);

        // 6. LIMPIEZA: Borrar los archivos de la carpeta 'uploads' para que desaparezcan
        // Recorremos todos los archivos subidos y los eliminamos del disco
        Object.values(files).forEach(fileArray => {
            fileArray.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                    console.log(`Archivo temporal eliminado: ${file.path}`);
                }
            });
        });

        // Opcional: Si quieres borrar también el PDF generado después de enviarlo:
        // if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

        // 7. Respuesta al cliente
        res.status(201).json({ 
            status: 'success', 
            message: 'Inscripción completa, PDF generado con anexos y archivos temporales eliminados', 
            id: recordId 
        });

    } catch (error) {
        console.error('Error en el proceso de inscripción:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { registerInscripcion };