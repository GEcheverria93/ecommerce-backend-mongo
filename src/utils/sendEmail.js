// Importamos el módulo nodemailer para el envío de emails
const nodemailer = require('nodemailer');

// Función asíncrona para enviar email de ticket
const sendTicketMail = async (to, ticket) => {
    // Configuración del transporter de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',           // Servicio de email a utilizar
        port: 587,                  // Puerto SMTP estándar
        auth: {
            // Credenciales desde variables de entorno
            user: process.env.NODEMAILER_USER,        // Email del remitente
            pass: process.env.NODEMAILER_PASSWORD,    // Contraseña de aplicación
        },
    });

    // Envío del email usando el transporter configurado
    await transporter.sendMail({
        from: process.env.NODEMAILER_MAILER,    // Remitente desde variable de entorno
        to,                                      // Destinatario recibido como parámetro
        subject: 'Ticket de compra',             // Asunto del email
        // Contenido HTML del email
        html: `
            <h1>Ticket de compra</h1>
            <div>
                <p>Total de compra: ${ticket.amount}</p>
                <p>Código: ${ticket.code}</p>
            </div>
        `,
    });
};

// Exportamos la función para su uso en otros archivos
module.exports = {
    sendTicketMail,
};
