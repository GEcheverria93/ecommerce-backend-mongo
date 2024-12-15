const CartDTO = require('../../dtos/cartDto');
const Cart = require('./models/cartModel');

class CartDAO {
    async create(cartData) {
        const cart = await Cart.create(cartData);
        return new CartDTO(cart);
    }

    async getById(id) {
        const cart = await Cart.findById(id).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async getAll(options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const carts = await Cart.find()
            .populate('products.product')
            .skip(skip)
            .limit(limit);

        return carts.map((cart) => new CartDTO(cart));
    }

    async update(id, cartData) {
        const cart = await Cart.findByIdAndUpdate(id, cartData, {
            new: true,
        }).populate('products.product');
        return cart ? new CartDTO(cart) : null;
    }

    async delete(id) {
        const cart = await Cart.findByIdAndDelete(id);
        return cart ? new CartDTO(cart) : null;
    }

    async deleteAll() {
        await Cart.deleteMany({});
    }
}

module.exports = CartDAO;
