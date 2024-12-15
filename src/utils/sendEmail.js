const nodemailer = require('nodemailer');

const sendTicketMail = async (to, ticket) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.NODEMAILER_MAILER,
        to,
        subject: 'Ticket de compra',
        html: `
            <h1>Ticket de compra</h1>
            <div>
                <p>Total de compra: ${ticket.amount}</p>
                <p>Código: ${ticket.code}</p>
            </div>
        `,
    });
};

module.exports = {
    sendTicketMail,
};
