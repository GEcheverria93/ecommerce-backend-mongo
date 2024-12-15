const uuid = require('uuid');
const TicketDAO = require('../daos/mongodb/ticketDAO');
const TicketDTO = require('../dtos/ticketDTO');

const { sendTicketMail } = require('../utils/sendEmail');

class TicketService {
    constructor() {
        this.ticketDao = new TicketDAO();
    }

    async create(amount, userEmail) {
        const newTicket = new TicketDTO({
            code: uuid,
            purchaser: userEmail,
            amount,
        });

        const ticket = this.ticketDao.create(newTicket);
        await sendTicketMail(userEmail, ticket);
        return ticket;
    }
}

module.exports = TicketService;
