const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const docxConverter = require('docx-pdf');

const generateInscriptionPDF = async (data, recordId) => {
    // 1. Cargar la plantilla Word
    const templatePath = path.resolve('templates/plantilla-formulario.docx');
    if (!fs.existsSync(templatePath)) {
        throw new Error("No se encontró la plantilla en templates/plantilla-formulario.docx");
    }
    const content = fs.readFileSync(templatePath, 'binary');
    let d = { dia: '', mes: '', anio: '' };
    if (data.fechaNacimiento) {
        const dateObj = new Date(data.fechaNacimiento);
        if (!isNaN(dateObj)) {
            d.dia = dateObj.getUTCDate();
            d.mes = dateObj.getUTCMonth() + 1;
            d.anio = dateObj.getUTCFullYear();
        }
    }
    // 2. Inyectar los datos en el Word
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.render({
        fechaActual: new Date().toLocaleDateString(),
        nombreCompleto: data.nombre + ' ' + data.apellido + ' ' + (data.segundoApellido || ''),
        tipoDoc: data.tipoDocumento,
        nroDoc: data.numeroDocumento,
        expedida: data.lugarExpedicion,
        rh: data.tipoSangre,
        diaNac: d.dia,
        mesNac: d.mes,
        anioNac: d.anio,
        departamento: data.departamentoNacimiento,
        ciudad: data.ciudadNacimiento,
        casado: data.estadoCivil === 'Casado' ? 'SI' : 'NO',
        direccion: data.direccion,
        municipio: data.municipioResidencia,
        telefono: data.telefono,
        eps: data.eps,
        correo: data.email,
        padre: data.nombrePadre,
        ccPadre: data.cedulaPadre,
        madre: data.nombreMadre,
        ccMadre: data.cedulaMadre,
        programa: data.carreraTecnicaDeseada,
        horario: data.horario || 'No Aplica',
        f_cedula: data.docIdentidad ? 'SI' : 'NO',
        f_foto: data.foto ? 'SI' : 'NO',
        f_cert: data.certificado ? 'SI' : 'NO',
        f_rut: data.rut ? 'SI' : 'NO'
    });

    // 3. Crear buffer y rutas
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    const tempDocxPath = path.resolve(`tmp/temp_${data.numeroDocumento}.docx`);
    const finalPdfPath = path.resolve(`tmp/Inscripcion_${data.numeroDocumento}.pdf`);

    // 4. Guardar archivo temporal DOCX
    fs.writeFileSync(tempDocxPath, buf);

    // 5. Convertir a PDF usando docx-pdf
    return new Promise((resolve, reject) => {
        docxConverter(tempDocxPath, finalPdfPath, (err, result) => {
            if (err) {
                if (fs.existsSync(tempDocxPath)) fs.unlinkSync(tempDocxPath);
                return reject(new Error("Fallo en conversión docx-pdf: " + err.message));
            }

            // Borrar el archivo temporal .docx
            try {
                if (fs.existsSync(tempDocxPath)) fs.unlinkSync(tempDocxPath);
            } catch (e) {
                console.warn("No se pudo borrar el temporal:", e.message);
            }

            resolve(finalPdfPath);
        });
    });
};

module.exports = { generateInscriptionPDF };