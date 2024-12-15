const DAOFactory = require('../daos/factory');
const TicketService = require('./ticketService');

const cartDao = DAOFactory.getCartDAO();
const productDao = DAOFactory.getProductDAO();
const ticketService = new TicketService();

class CartService {
    async createCart(cartData) {
        return cartDao.create(cartData);
    }

    async getAllCarts(options = {}) {
        return cartDao.getAll(options);
    }

    async getCartById(cartId) {
        return cartDao.getById(cartId);
    }

    async addProductToCart(cartId, productId) {
        const cart = await cartDao.getById(cartId);
        if (!cart) return null;

        const product = await productDao.getById(productId);
        if (!product) return null;

        const cartProduct = cart.products.find(
            (p) => p.product.toString() === productId
        );

        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        return cartDao.update(cartId, cart);
    }

    async purchase(cid, userEmail) {
        const cart = await cartDao.getById(cid).populate('products.product');
        if (!cart) return null;

        let totalAmount = 0;
        const failedProducts = [];
        const purchasedProducts = [];

        const productPromises = cart.products.map(async (cartItem) => {
            const { product } = cartItem;
            const { quantity } = cartItem;

            if (product.stock >= quantity) {
                product.stock -= quantity;
                await product.save();

                totalAmount += product.price * quantity;
                purchasedProducts.push(cartItem);
            } else {
                failedProducts.push({
                    productId: product._id,
                    availableStock: product.stock,
                });
            }
        });
        await Promise.all(productPromises);

        let ticket = null;
        if (totalAmount > 0) {
            ticket = await ticketService.create(totalAmount, userEmail);
        }

        cart.products = cart.products.filter((item) =>
            failedProducts.some((f) => f.productId.equals(item.product._id))
        );
        await cart.save();

        const summary = {
            ticket,
            failedProducts,
        };

        return summary;
    }

    async updateCart(cartId, cartData) {
        return cartDao.update(cartId, cartData);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartDao.getById(cartId);
        if (!cart) return null;

        const cartProduct = cart.products.find(
            (p) => p.product.toString() === productId
        );
        if (!cartProduct) return null;

        if (quantity <= 0) {
            cart.products = cart.products.filter(
                (p) => p.product.toString() !== productId
            );
        } else {
            cartProduct.quantity = quantity;
        }

        return cartDao.update(cartId, cart);
    }

    async removeProduct(cartId, productId) {
        const cart = await cartDao.getById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== productId
        );

        return cartDao.update(cartId, cart);
    }

    async clearCart(cartId) {
        return cartDao.update(cartId, { products: [] });
    }

    async deleteAllCarts() {
        return cartDao.deleteAll();
    }
}

module.exports = new CartService();
