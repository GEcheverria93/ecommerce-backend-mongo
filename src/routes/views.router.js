const express = require('express');
const { readProducts } = require('../services/productService');

const router = express.Router();

router.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products, title: 'Tienda' });
});

router.get('/cart', (req, res) => {
    res.render('cart', { title: 'Carrito de Compras' });
});

module.exports = router;
