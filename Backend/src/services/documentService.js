const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');
const { promisify } = require('util');

// Usamos promisify correctamente solo si la versión de libre no tiene .convertAsync
const convertAsync = promisify(libre.convert);

const generateInscriptionPDF = async (data, recordId) => {
    // Ruta de la plantilla (Asegúrate de que el nombre sea exacto)
    const templatePath = path.resolve('templates/plantilla-formulario.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Mapeado a las etiquetas del archivo Word {}
    doc.render({
        fechaActual: new Date().toLocaleDateString(),
        nombreCompleto: data.nombreCompleto,
        tipoDoc: data.tipoDocumento,
        nroDoc: data.numeroDocumento,
        expedida: data.expedidaEn,
        rh: data.rh,
        diaNac: data.diaNacimiento,
        mesNac: data.mesNacimiento,
        anioNac: data.anioNacimiento,
        departamento: data.id_departamento, // O data.departamento si lo cambias
        ciudad: data.ciudad,
        casado: data.estadoCivil === 'Casado' ? 'SI' : 'NO',
        direccion: data.direccion,
        municipio: data.municipio,
        telefono: data.telefono,
        eps: data.eps,
        correo: data.correo,
        padre: data.nombrePadre,
        ccPadre: data.ccPadre,
        madre: data.nombreMadre,
        ccMadre: data.ccMadre,
        programa: data.programaInteres,
        horario: data.horario,
        // Checkboxes de documentos
        f_cedula: data.docIdentidad ? 'SI' : 'NO',
        f_foto: data.foto ? 'SI' : 'NO',
        f_cert: data.certificado ? 'SI' : 'NO',
        f_rut: data.rut ? 'SI' : 'NO'
    });

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    
    // Conversión a PDF (LibreOffice debe estar instalado)
    const pdfBuf = await convertAsync(buf, '.pdf', undefined);
    const pdfPath = path.resolve(`uploads/Inscripcion_${data.numeroDocumento}.pdf`);
    
    fs.writeFileSync(pdfPath, pdfBuf);
    
    return pdfPath;
};

module.exports = { generateInscriptionPDF };