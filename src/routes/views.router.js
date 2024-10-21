/* eslint-disable node/no-unsupported-features/es-syntax */
const express = require('express');
const { readProducts } = require('../services/productService');
const { readCarts } = require('../services/cartService'); // Importar la función para leer carritos

const router = express.Router();

router.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products, title: 'Tienda' });
});

router.get('/cart', (req, res) => {
    const carts = readCarts(); // Leer los carritos
    const products = readProducts(); // Leer los productos

    // Mapear los carritos para incluir la información completa de los productos
    const cartsWithProductDetails = carts.map((cart) => ({
        ...cart,
        products: cart.products.map((cartProduct) => {
            const product = products.find((p) => p.id === cartProduct.product);
            return {
                ...cartProduct,
                title: product ? product.title : 'Producto no encontrado',
                price: product ? product.price : 0,
            };
        }),
    }));

    res.render('cart', {
        title: 'Carrito de Compras',
        carts: cartsWithProductDetails,
    }); // Pasar los carritos con detalles a la vista
});

module.exports = router;
