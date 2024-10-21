const express = require('express');
const {
    addNewCart,
    getProductsByCartId,
    addProductToCart,
} = require('../services/cartService');

const router = express.Router();

router.post('/', addNewCart);

router.get('/:cid', getProductsByCartId);

router.post('/:cid/product/:pid', addProductToCart);

module.exports = router;
