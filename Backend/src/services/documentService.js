const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');

const generateInscriptionPDF = async (data, files) => {
    let browser;
    try {
        const templatePath = path.resolve('templates/plantilla-formulario.html');
        const imagePath = path.resolve('templates/imagenes/personal.png');
        const outputDir = path.resolve('tmp');

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        // --- PASO 1: GENERAR EL FORMULARIO (PÁGINA 1) ---
        let html = fs.readFileSync(templatePath, 'utf8');

        // Logo a Base64
        let base64Image = '';
        if (fs.existsSync(imagePath)) {
            const bitmap = fs.readFileSync(imagePath);
            base64Image = `data:image/png;base64,${bitmap.toString('base64')}`;
        }

        // Procesar Fechas
        const d = data.fechaNacimiento ? new Date(data.fechaNacimiento) : new Date();
        
        const variables = {
            headerImage: base64Image,
            fechaActual: new Date().toLocaleDateString('es-CO'),
            nombreCompleto: `${data.nombre || ''} ${data.apellido || ''} ${data.segundoApellido || ''}`.trim(),
            tipoDoc: data.tipoDocumento || '',
            nroDoc: data.numeroDocumento || '',
            expedida: data.lugarExpedicion || '',
            rh: data.tipoSangre || '',
            diaNac: d.getUTCDate(),
            mesNac: d.getUTCMonth() + 1,
            anioNac: d.getUTCFullYear(),
            departamento: data.departamentoNacimiento || '',
            ciudad: data.ciudadNacimiento || '',
            casado: data.estadoCivil === 'Casado' ? 'SI' : 'NO',
            direccion: data.direccion || '',
            municipio: data.municipioResidencia || '',
            telefono: data.telefono || '',
            eps: data.eps || '',
            correo: data.email || '',
            padre: data.nombrePadre || '',
            ccPadre: data.cedulaPadre || '',
            madre: data.nombreMadre || '',
            ccMadre: data.cedulaMadre || '',
            programa: data.carreraTecnicaDeseada || '',
            horario: data.horario || 'No Aplica',
            // Checkboxes basados en la existencia real de archivos
            f_cedula: !!files['docIdentidad'] ? '☑' : '☐',
            f_foto: !!files['foto'] ? '☑' : '☐',
            f_cert: !!files['certificado'] ? '☑' : '☐',
            f_diploma: !!files['diploma'] ? '☑' : '☐',
            f_rut: !!files['rut'] ? '☑' : '☐'
        };

        // Reemplazo robusto
        for (const key in variables) {
            html = html.split(`{{${key}}}`).join(variables[key] ?? '');
        }

        browser = await chromium.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle' });
        const formPdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });
        await browser.close();

        // --- PASO 2: UNIR CON LOS ADJUNTOS USANDO PDF-LIB ---
        const finalPdfDoc = await PDFDocument.create();
        
        // Añadir el formulario base
        const basePdf = await PDFDocument.load(formPdfBuffer);
        const copiedPages = await finalPdfDoc.copyPages(basePdf, basePdf.getPageIndices());
        copiedPages.forEach(p => finalPdfDoc.addPage(p));

        // Lista de campos de archivos para iterar en orden
        const fileKeys = ['docIdentidad', 'foto', 'certificado', 'diploma', 'rut'];

        for (const key of fileKeys) {
            if (files[key] && files[key][0]) {
                const file = files[key][0];
                const filePath = file.path;
                const ext = path.extname(file.originalname).toLowerCase();

                if (fs.existsSync(filePath)) {
                    if (ext === '.pdf') {
                        const attachBytes = fs.readFileSync(filePath);
                        const attachDoc = await PDFDocument.load(attachBytes);
                        const pages = await finalPdfDoc.copyPages(attachDoc, attachDoc.getPageIndices());
                        pages.forEach(p => finalPdfDoc.addPage(p));
                    } 
                    else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        const imgBytes = fs.readFileSync(filePath);
                        const newPage = finalPdfDoc.addPage([612, 792]); // Tamaño Carta
                        
                        let img;
                        if (ext === '.png') img = await finalPdfDoc.embedPng(imgBytes);
                        else img = await finalPdfDoc.embedJpg(imgBytes);

                        const dims = img.scaleToFit(500, 700);
                        newPage.drawImage(img, {
                            x: 50,
                            y: 742 - dims.height,
                            width: dims.width,
                            height: dims.height,
                        });
                    }
                }
            }
        }

        const mergedPdfBytes = await finalPdfDoc.save();
        const finalPath = path.join(outputDir, `Inscripcion_${data.numeroDocumento}.pdf`);
        fs.writeFileSync(finalPath, mergedPdfBytes);

        return finalPath;

    } catch (error) {
        console.error("Error en PDF Service:", error);
        if (browser) await browser.close();
        throw error;
    }
};

module.exports = { generateInscriptionPDF };