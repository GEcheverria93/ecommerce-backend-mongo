const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');

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
    const cart = new Cart({
        products: [
            { product: savedProducts[0]._id, quantity: 1 }, // Usar el ID del producto guardado
            { product: savedProducts[1]._id, quantity: 4 }, // Usar el ID del producto guardado
        ],
    });

    await cart.save(); // Guardar el carrito

    console.log('Carrito inicial creado.');

    mongoose.connection.close(); // Cerrar la conexión
};

migrate().catch((err) => {
    console.error('Error en la migración:', err);
    mongoose.connection.close();
});
