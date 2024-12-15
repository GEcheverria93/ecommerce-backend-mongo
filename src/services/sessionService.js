const jwt = require('jsonwebtoken');
const DAOFactory = require('../daos/factory');

class SessionService {
    constructor() {
        this.userDao = DAOFactory.getUserDAO();
        this.cartDao = DAOFactory.getCartDAO();
    }

    generateToken(user) {
        return jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    async register(userData) {
        const cart = await this.cartDao.create({ products: [] });
        const user = await this.userDao.create({
            ...userData,
            cart: cart.id,
        });
        return user;
    }

    async login(email, password) {
        const user = await this.userDao.findByEmailWithPassword(email);
        if (!user || !user.comparePassword(password)) {
            throw new Error('Credenciales inválidas');
        }

        const userDto = await this.userDao.findByEmail(email);
        const token = this.generateToken(userDto);

        await this.userDao.update(user.id, { lastLogin: new Date() });

        return { token, user: userDto };
    }

    async getCurrentUser(userId) {
        return this.userDao.findById(userId);
    }
}

module.exports = new SessionService();
