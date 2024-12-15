class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map((item) => ({
            product: {
                _id: item.product._id,
                title: item.product.title,
                price: item.product.price,
            },
            quantity: item.quantity,
        }));
        this.total = this.calculateTotal();
    }

    calculateTotal() {
        return this.products.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    }
}

module.exports = CartDTO;
