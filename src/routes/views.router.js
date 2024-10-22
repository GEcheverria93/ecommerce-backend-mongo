/* eslint-disable node/no-unsupported-features/es-syntax */
const express = require('express');
const { getAllProducts } = require('../services/productService');
const { readCarts } = require('../services/cartService'); // Importar la función para leer carritos

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await getAllProducts(req, res); // Llama a la función que maneja la lógica de paginación y filtrado
        res.render('home', {
            products: result.payload, // Usa el payload para los productos
            title: 'Tienda',
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: req.query.limit || 10, // Mantener el límite actual
            page: req.query.page || 1, // Mantener la página actual
            sort: req.query.sort || '', // Mantener el orden actual
            query: req.query.query || '', // Mantener la consulta actual
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
});

router.get('/cart', (req, res) => {
    const carts = readCarts(); // Leer los carritos
    const products = []; // Leer los productos

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
