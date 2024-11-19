const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');

const generateToken = (user) =>
    jwt.sign(
        { sub: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

const register = async (userData) => {
    // Crear carrito para el nuevo usuario
    const cart = new Cart({ products: [] });
    await cart.save();

    // Crear usuario con referencia al carrito
    const user = new User({
        ...userData,
        cart: cart._id,
    });
    await user.save();

    return user;
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
        throw new Error('Credenciales inválidas');
    }

    const token = generateToken(user);
    return { token, user };
};

module.exports = {
    register,
    login,
    generateToken,
};
