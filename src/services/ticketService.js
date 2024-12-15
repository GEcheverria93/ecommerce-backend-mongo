// Importaciones necesarias
const uuid = require('uuid');                          // Para generar IDs únicos
const DAOFactory = require('../daos/factory');         // Factory para DAOs
const TicketDTO = require('../dtos/ticketDTO');        // DTO para tickets

// Importación de utilidad para envío de emails
const { sendTicketMail } = require('../utils/sendEmail');

class TicketService {
    constructor() {
        // Inicialización del DAO para tickets
        this.ticketDao = DAOFactory.getTicketDAO();
    }

    // Método para crear un nuevo ticket
    async create(amount, userEmail) {
        // Crear nuevo DTO de ticket con los datos necesarios
        const newTicket = new TicketDTO({
            code: uuid,                // Código único generado con uuid
            purchaser: userEmail,      // Email del comprador
            amount,                    // Monto total de la compra
        });

        // Crear el ticket en la base de datos
        const ticket = this.ticketDao.create(newTicket);
        
        // Enviar email con los detalles del ticket
        await sendTicketMail(userEmail, ticket);
        
        // Retornar el ticket creado
        return ticket;
    }
}

// Exportar la clase TicketService
module.exports = TicketService;
