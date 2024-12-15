const express = require('express');
const CartController = require('../controllers/cartController');

const router = express.Router();

// Rutas para carritos
router.post('/', CartController.createCart);
router.get('/', CartController.getAllCarts);
router.get('/:cid', CartController.getCartProducts);
router.post('/:cid/product/:pid', CartController.addProductToCart);
router.put('/:cid', CartController.updateCart);
router.put('/:cid/products/:pid', CartController.updateProductQuantity);
router.delete('/:cid/products/:pid', CartController.deleteProductFromCart);
router.delete('/:cid', CartController.clearCart);
router.delete('/', CartController.deleteAllCarts);

module.exports = router;
