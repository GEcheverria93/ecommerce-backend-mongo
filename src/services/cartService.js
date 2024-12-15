const DAOFactory = require('../daos/factory');

const cartDao = DAOFactory.getCartDAO();
const productDao = DAOFactory.getProductDAO();

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
