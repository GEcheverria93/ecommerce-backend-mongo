const express = require('express');
const {
    addNewCart,
    getProductsByCartId,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart,
} = require('../services/cartService');

const router = express.Router();

router.post('/', addNewCart);

router.get('/:cid', getProductsByCartId);

router.post('/:cid/product/:pid', addProductToCart);

router.delete('/:cid/products/:pid', deleteProductFromCart);

router.put('/:cid', updateCart);

router.put('/:cid/products/:pid', updateProductQuantity);

router.delete('/:cid', clearCart);

module.exports = router;
