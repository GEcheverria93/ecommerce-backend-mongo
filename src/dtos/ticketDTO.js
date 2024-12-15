class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code;
        this.purchaser = ticket.purchaser;
        this.amount = ticket.amount;
    }
}

module.exports = TicketDTO;
