const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Product = require('./daos/mongodb/models/productModel');
const Cart = require('./daos/mongodb/models/cartModel');
const User = require('./daos/mongodb/models/userModel');

dotenv.config();

const migrate = async () => {
    await connectDB();

    // Crear productos iniciales
    const products = [
        {
            title: 'Laptop Lenovo',
            description: '16gb RAM, 1TB nvme vs m.2, 3060RTX',
            code: 'CB690',
            price: 3000,
            status: true,
            stock: 1,
            category: 'Laptop',
            thumbnails: ['laptop-CB690.jpg'],
        },
        {
            title: 'Desktop Computer Asus',
            description: '32b RAM, 2TB nvme vs m.2, 4090RTX',
            code: 'PSE200',
            price: 6000,
            status: true,
            stock: 1,
            category: 'Desktop',
            thumbnails: ['desktop-PSE200.jpg'],
        },
    ];

    await Product.deleteMany(); // Limpiar la colección de productos
    const savedProducts = await Product.insertMany(products); // Insertar productos
    console.log('Productos iniciales creados.');

    // Crear un carrito inicial
    await Cart.deleteMany(); // Limpiar la colección de carritos
    const cart = new Cart({
        products: [
            { product: savedProducts[0]._id, quantity: 1 },
            { product: savedProducts[1]._id, quantity: 4 },
        ],
    });
    const savedCart = await cart.save();
    console.log('Carrito inicial creado.');

    // Crear usuarios iniciales
    await User.deleteMany(); // Limpiar la colección de usuarios
    const users = [
        {
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@example.com',
            age: 30,
            password: 'admin123',
            cart: savedCart._id,
            role: 'admin',
        },
        {
            first_name: 'Regular',
            last_name: 'User',
            email: 'user@example.com',
            age: 25,
            password: 'user123',
            cart: savedCart._id,
            role: 'user',
        },
    ];

    await User.insertMany(users);
    console.log('Usuarios iniciales creados.');

    mongoose.connection.close(); // Cerrar la conexión
};

migrate().catch((err) => {
    console.error('Error en la migración:', err);
    mongoose.connection.close();
});
