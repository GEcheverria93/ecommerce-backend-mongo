const UserDAO = require('./mongodb/userDao');
const ProductDAO = require('./mongodb/productDao');
const CartDAO = require('./mongodb/cartDao');

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
}

module.exports = DAOFactory;
