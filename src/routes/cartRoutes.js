const express = require('express');
const {
    addNewCart,
    getProductsByCartId,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart,
    getAllCarts,
} = require('../services/cartService');
const Cart = require('../models/cartModel');

const router = express.Router();

router.post('/', addNewCart);

router.get('/', async (req, res) => {
    try {
        const carts = await getAllCarts(); // Obtener los carritos desde la base de datos
        const cartItemsCount = carts.map((cart) => ({
            id: cart._id,
            count: cart.products.length, // Contar los productos en cada carrito
        }));
        res.json(cartItemsCount); // Devolver los carritos y sus conteos en formato JSON
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ message: 'Error al obtener carritos', error });
    }
});

router.get('/:cid', getProductsByCartId);

router.post('/:cid/product/:pid', addProductToCart);

router.delete('/:cid/products/:pid', deleteProductFromCart);

router.put('/:cid', updateCart);

router.put('/:cid/products/:pid', updateProductQuantity);

router.delete('/:cid', clearCart);

router.delete('/', async (req, res) => {
    try {
        await Cart.deleteMany(); // Eliminar todos los carritos
        res.status(200).json({
            message: 'Todos los carritos han sido eliminados',
        });
    } catch (error) {
        console.error('Error al eliminar todos los carritos:', error);
        res.status(500).json({
            message: 'Error al eliminar todos los carritos',
            error,
        });
    }
});

module.exports = router;
