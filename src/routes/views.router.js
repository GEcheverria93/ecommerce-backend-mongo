/* eslint-disable node/no-unsupported-features/es-syntax */
const express = require('express');
const { getAllProducts } = require('../services/productService');
const { getAllCarts } = require('../services/cartService'); // Importar la nueva función para obtener carritos

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

router.get('/carts', async (req, res) => {
    try {
        const carts = await getAllCarts(); // Obtener los carritos desde la base de datos
        res.render('carts', {
            title: 'Carritos de Compras',
            carts, // Pasar los carritos directamente a la vista
        });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ message: 'Error al obtener carritos', error });
    }
});

module.exports = router;
