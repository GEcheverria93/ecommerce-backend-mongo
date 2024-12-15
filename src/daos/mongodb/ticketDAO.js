const Ticket = require('./models/ticketModel');

class TicketDAO {
    async getAll() {
        const tickets = await Ticket.find();
        return tickets;
    }

    async getById(id) {
        const ticket = await Ticket.findById(id);
        return ticket;
    }

    async getBy(filters) {
        const ticket = await Ticket.findOne(filters);
        return ticket;
    }

    async create(data) {
        const ticket = await Ticket.create(data);
        return ticket;
    }

    async update(id, data) {
        const ticket = await Ticket.findOneAndUpdate(id, data, {
            new: true,
        });
        return ticket;
    }

    async deleteOne(id) {
        const ticket = await Ticket.deleteOne({ _id: id });
        return ticket;
    }
}

module.exports = TicketDAO;
