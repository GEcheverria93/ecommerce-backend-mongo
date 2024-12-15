// Importaciones necesarias
const express = require('express');
const CartController = require('../controllers/cartController');

// Creación del router de Express
const router = express.Router();

// Definición de rutas para carritos

// POST / - Crear un nuevo carrito
router.post('/', CartController.createCart);

// GET / - Obtener todos los carritos
router.get('/', CartController.getAllCarts);

// GET /:cid - Obtener productos de un carrito específico
router.get('/:cid', CartController.getCartProducts);

// POST /:cid/product/:pid - Agregar un producto a un carrito
router.post('/:cid/product/:pid', CartController.addProductToCart);

// POST /:cid/purchase - Realizar la compra de un carrito
router.post('/:cid/purchase', CartController.purchase);

// PUT /:cid - Actualizar un carrito completo
router.put('/:cid', CartController.updateCart);

// PUT /:cid/products/:pid - Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', CartController.updateProductQuantity);

// DELETE /:cid/products/:pid - Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', CartController.deleteProductFromCart);

// DELETE /:cid - Vaciar un carrito específico
router.delete('/:cid', CartController.clearCart);

// DELETE / - Eliminar todos los carritos
router.delete('/', CartController.deleteAllCarts);

// Exportar el router
module.exports = router;
