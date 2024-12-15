const uuid = require('uuid');
const DAOFactory = require('../daos/factory');
const TicketDTO = require('../dtos/ticketDTO');

const { sendTicketMail } = require('../utils/sendEmail');

class TicketService {
    constructor() {
        this.ticketDao = DAOFactory.getTicketDAO();
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
