// Importaciones necesarias
const DAOFactory = require('../daos/factory');
const TicketService = require('./ticketService');

// Inicialización de DAOs y servicios
const cartDao = DAOFactory.getCartDAO(); // DAO para carritos
const productDao = DAOFactory.getProductDAO(); // DAO para productos
const ticketService = new TicketService(); // Servicio de tickets

class CartService {
    // Crear un nuevo carrito
    async createCart(cartData) {
        return cartDao.create(cartData);
    }

    // Obtener todos los carritos con opciones de filtrado
    async getAllCarts(options = {}) {
        return cartDao.getAll(options);
    }

    // Obtener un carrito por su ID
    async getCartById(cartId) {
        return cartDao.getById(cartId);
    }

    // Añadir un producto al carrito
    async addProductToCart(cartId, productId) {
        // Buscar el carrito
        const cart = await cartDao.getById(cartId);
        if (!cart) return null;

        // Verificar que el producto existe
        const product = await productDao.getById(productId);
        if (!product) return null;

        // Buscar si el producto ya está en el carrito
        const cartProduct = cart.products.find(
            (p) => p.product.toString() === productId
        );

        // Actualizar cantidad o agregar nuevo producto
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        return cartDao.update(cartId, cart);
    }

    // Realizar la compra del carrito
    async purchase(cid, userEmail) {
        // Obtener carrito con productos populados
        const cart = await cartDao.getById(cid).populate('products.product');
        if (!cart) return null;

        let totalAmount = 0;
        const failedProducts = []; // Productos que no se pudieron comprar
        const purchasedProducts = []; // Productos comprados exitosamente

        // Procesar cada producto del carrito
        const productPromises = cart.products.map(async (cartItem) => {
            const { product } = cartItem;
            const { quantity } = cartItem;

            // Verificar stock disponible
            if (product.stock >= quantity) {
                // Actualizar stock y calcular total
                product.stock -= quantity;
                await product.save();
                totalAmount += product.price * quantity;
                purchasedProducts.push(cartItem);
            } else {
                // Registrar productos sin stock suficiente
                failedProducts.push({
                    productId: product._id,
                    availableStock: product.stock,
                });
            }
        });
        await Promise.all(productPromises);

        // Crear ticket si hay productos comprados
        let ticket = null;
        if (totalAmount > 0) {
            ticket = await ticketService.create(totalAmount, userEmail);
        }

        // Actualizar carrito con productos fallidos
        cart.products = cart.products.filter((item) =>
            failedProducts.some((f) => f.productId.equals(item.product._id))
        );
        await cart.save();

        // Retornar resumen de la compra
        const summary = {
            ticket,
            failedProducts,
        };

        return summary;
    }

    // Actualizar carrito completo
    async updateCart(cartId, cartData) {
        return cartDao.update(cartId, cartData);
    }

    // Actualizar cantidad de un producto
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartDao.getById(cartId);
        if (!cart) return null;

        const cartProduct = cart.products.find(
            (p) => p.product.toString() === productId
        );
        if (!cartProduct) return null;

        // Eliminar producto si cantidad es 0 o menor
        if (quantity <= 0) {
            cart.products = cart.products.filter(
                (p) => p.product.toString() !== productId
            );
        } else {
            cartProduct.quantity = quantity;
        }

        return cartDao.update(cartId, cart);
    }

    // Eliminar un producto del carrito
    async removeProduct(cartId, productId) {
        const cart = await cartDao.getById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== productId
        );

        return cartDao.update(cartId, cart);
    }

    // Vaciar un carrito
    async clearCart(cartId) {
        return cartDao.update(cartId, { products: [] });
    }

    // Eliminar todos los carritos
    async deleteAllCarts() {
        return cartDao.deleteAll();
    }
}

// Exportar una instancia del servicio
module.exports = new CartService();
