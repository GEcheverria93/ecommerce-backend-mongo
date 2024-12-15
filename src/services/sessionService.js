// Importación de módulos necesarios
const jwt = require('jsonwebtoken');        // Para manejo de tokens JWT
const DAOFactory = require('../daos/factory');

class SessionService {
    constructor() {
        // Inicialización de DAOs necesarios
        this.userDao = DAOFactory.getUserDAO();    // DAO para usuarios
        this.cartDao = DAOFactory.getCartDAO();    // DAO para carritos
    }

    // Método para generar token JWT
    generateToken(user) {
        return jwt.sign(
            { 
                sub: user.id,           // ID del usuario
                email: user.email,      // Email del usuario
                role: user.role         // Rol del usuario
            },
            process.env.JWT_SECRET,     // Clave secreta desde variables de entorno
            { expiresIn: '24h' }        // Token válido por 24 horas
        );
    }

    // Método para registro de usuarios
    async register(userData) {
        // Crear un carrito vacío para el nuevo usuario
        const cart = await this.cartDao.create({ products: [] });
        
        // Crear el usuario con referencia al carrito
        const user = await this.userDao.create({
            ...userData,                // Datos del usuario
            cart: cart.id,              // ID del carrito creado
        });
        return user;
    }

    // Método para login de usuarios
    async login(email, password) {
        // Buscar usuario con contraseña (para comparación)
        const user = await this.userDao.findByEmailWithPassword(email);
        
        // Validar credenciales
        if (!user || !user.comparePassword(password)) {
            throw new Error('Credenciales inválidas');
        }

        // Obtener versión DTO del usuario (sin datos sensibles)
        const userDto = await this.userDao.findByEmail(email);
        
        // Generar token JWT
        const token = this.generateToken(userDto);

        // Actualizar última fecha de login
        await this.userDao.update(user.id, { lastLogin: new Date() });

        // Retornar token y datos del usuario
        return { token, user: userDto };
    }

    // Método para obtener usuario actual
    async getCurrentUser(userId) {
        return this.userDao.findById(userId);
    }
}

// Exportar una instancia del servicio
module.exports = new SessionService();
