const express = require('express');
const { readProducts } = require('../services/productService');

const router = express.Router();

router.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products, title: 'Home' });
});

module.exports = router;
