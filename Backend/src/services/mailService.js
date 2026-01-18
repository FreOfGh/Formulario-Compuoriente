const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.smtp_host,
    port: process.env.smtp_port,
    secure: true, // SMTPS
    auth: {
        user: process.env.smtp_user,
        pass: process.env.smtp_pass
    }
});

const sendConfirmationEmails = async (data, pdfPath) => {
    // 1. Correo para el Politécnico (con el PDF adjunto)
    await transporter.sendMail({
        from: process.env.email_from,
        to: process.env.email_test, // process.env.email_secretaria,
        subject: `📝 Inscripción: ${data.programaInteres} - ${data.nombreCompleto}`,
        html: `<p>Se ha recibido una nueva inscripción. Se adjunta la ficha técnica en PDF.</p>`,
        attachments: [{ filename: `Ficha_${data.numeroDocumento}.pdf`, path: pdfPath }]
    });

    // 2. Correo para el Alumno
    await transporter.sendMail({
        from: process.env.email_from,
        to: data.correo,
        subject: '✅ Recibimos tu inscripción - Politécnico Compuoriente',
        html: `<h1>¡Hola, ${data.nombreCompleto}!</h1>
               <p>Tu proceso de inscripción para el programa <b>${data.programaInteres}</b> ha sido recibido con éxito.</p>
               <p>Pronto nos comunicaremos contigo al teléfono ${data.telefono}.</p>`
    });
};

module.exports = { sendConfirmationEmails };