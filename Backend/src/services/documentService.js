const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');

const generateInscriptionPDF = async (data, files) => {
    let browser = null; // Definimos browser aquí para que el try/catch/finally lo vea

    try {
        const templatePath = path.resolve('templates/plantilla-formulario.html');
        const imagePath = path.resolve('templates/imagenes/personal.png');
        const outputDir = path.resolve('tmp');

        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        // --- PREPARACIÓN DEL HTML ---
        let html = fs.readFileSync(templatePath, 'utf8');

        let base64Image = '';
        if (fs.existsSync(imagePath)) {
            const bitmap = fs.readFileSync(imagePath);
            base64Image = `data:image/png;base64,${bitmap.toString('base64')}`;
        }

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
            f_cedula: !!files['docIdentidad'] ? '☑' : '☐',
            f_foto: !!files['foto'] ? '☑' : '☐',
            f_cert: !!files['certificado'] ? '☑' : '☐',
            f_diploma: !!files['diploma'] ? '☑' : '☐',
            f_rut: !!files['rut'] ? '☑' : '☐'
        };

        for (const key in variables) {
            html = html.split(`{{${key}}}`).join(variables[key] ?? '');
        }

        // --- LANZAMIENTO DE PLAYWRIGHT (OPTIMIZADO) ---
        // Eliminamos la doble declaración 'const' y 'let' repetida
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote',
                '--single-process'
            ]
        });

        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.setContent(html, { waitUntil: 'networkidle' });
        const formPdfBuffer = await page.pdf({ format: 'Letter', printBackground: true });
        
        await browser.close();
        browser = null; // Marcamos como cerrado para el catch

        // --- UNIÓN DE PDFS CON PDF-LIB ---
        const finalPdfDoc = await PDFDocument.create();
        const basePdf = await PDFDocument.load(formPdfBuffer);
        const copiedPages = await finalPdfDoc.copyPages(basePdf, basePdf.getPageIndices());
        copiedPages.forEach(p => finalPdfDoc.addPage(p));

        const fileKeys = ['docIdentidad', 'foto', 'certificado', 'diploma', 'rut'];

        for (const key of fileKeys) {
            if (files[key] && files[key][0]) {
                const file = files[key][0];
                const filePath = file.path;
                const ext = path.extname(file.originalname).toLowerCase();

                if (fs.existsSync(filePath)) {
                    const fileBytes = fs.readFileSync(filePath);
                    if (ext === '.pdf') {
                        const attachDoc = await PDFDocument.load(fileBytes);
                        const pages = await finalPdfDoc.copyPages(attachDoc, attachDoc.getPageIndices());
                        pages.forEach(p => finalPdfDoc.addPage(p));
                    } 
                    else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        const newPage = finalPdfDoc.addPage([612, 792]);
                        const img = (ext === '.png') 
                            ? await finalPdfDoc.embedPng(fileBytes) 
                            : await finalPdfDoc.embedJpg(fileBytes);

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
        console.error("Error detallado en PDF Service:", error);
        throw error;
    } finally {
        // Cierre seguro del navegador si quedó abierto por error
        if (browser) {
            await browser.close().catch(() => {});
        }
    }
};

module.exports = { generateInscriptionPDF };