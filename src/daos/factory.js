const UserDAO = require('./mongodb/userDao');
const ProductDAO = require('./mongodb/productDao');
const CartDAO = require('./mongodb/cartDao');
const TicketDAO = require('./mongodb/ticketDAO');

class DAOFactory {
    static getUserDAO() {
        return new UserDAO();
    }

    static getProductDAO() {
        return new ProductDAO();
    }

    static getCartDAO() {
        return new CartDAO();
    }

    static getTicketDAO() {
        return new TicketDAO();
    }
}

module.exports = DAOFactory;
