const CartService = require('../services/cartService');

class CartController {
    async createCart(req, res) {
        try {
            const { products } = req.body;
            const cart = await CartService.createCart({
                products: products || [],
            });
            res.status(201).json(cart);
        } catch (error) {
            res.status(400).json({
                message: 'Error al crear el carrito',
                error: error.message,
            });
        }
    }

    async getAllCarts(req, res) {
        try {
            const carts = await CartService.getAllCarts();
            const cartItemsCount = carts.map((cart) => ({
                id: cart.id,
                count: cart.products.length,
            }));
            res.json(cartItemsCount);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener carritos',
                error: error.message,
            });
        }
    }

    async getCartProducts(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartService.getCartById(cid);
            if (!cart) {
                return res
                    .status(404)
                    .json({ message: 'Carrito no encontrado' });
            }
            res.json(cart.products);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener productos del carrito',
                error: error.message,
            });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await CartService.addProductToCart(cid, pid);
            if (!updatedCart) {
                return res
                    .status(404)
                    .json({ message: 'Carrito o producto no encontrado' });
            }
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({
                message: 'Error al agregar producto al carrito',
                error: error.message,
            });
        }
    }

    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            const updatedCart = await CartService.updateCart(cid, { products });
            if (!updatedCart) {
                return res
                    .status(404)
                    .json({ message: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar el carrito',
                error: error.message,
            });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await CartService.updateProductQuantity(
                cid,
                pid,
                quantity
            );
            if (!updatedCart) {
                return res
                    .status(404)
                    .json({ message: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar la cantidad del producto',
                error: error.message,
            });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await CartService.removeProduct(cid, pid);
            if (!updatedCart) {
                return res
                    .status(404)
                    .json({ message: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar producto del carrito',
                error: error.message,
            });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartService.clearCart(cid);
            if (!cart) {
                return res
                    .status(404)
                    .json({ message: 'Carrito no encontrado' });
            }
            res.json({ message: 'Carrito vaciado con éxito' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al vaciar el carrito',
                error: error.message,
            });
        }
    }

    async deleteAllCarts(req, res) {
        try {
            await CartService.deleteAllCarts();
            res.json({ message: 'Todos los carritos han sido eliminados' });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar todos los carritos',
                error: error.message,
            });
        }
    }
}

module.exports = new CartController();
