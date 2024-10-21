/* eslint-disable node/no-unsupported-features/es-syntax */
const fS = require('fs');
const path = require('path');
const { readProducts } = require('./productService');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

const readCarts = () => {
    const data = fS.readFileSync(cartsFilePath, 'utf-8');

    return JSON.parse(data);
};

const writeCarts = (carts) => {
    fS.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};
const generateNewCartId = (carts) =>
    Math.max(...carts.map((c) => Number(c.id)), 0) + 1;

const addNewCart = (req, res) => {
    const { products } = req.body;
    const carts = readCarts();
    const newCart = {
        id: generateNewCartId(carts),
        products: products || [],
    };
    carts.push(newCart);
    writeCarts(carts);
    return res.status(201).json(newCart);
};

const getProductsByCartId = (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find((c) => c.id === Number(cid));
    if (!cart) {
        return res.status(404).json({ message: 'carrito no encontrado' });
    }
    return res.json(cart.products);
};

const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const products = readProducts();
    const cart = carts.find((c) => c.id === Number(cid));
    if (!cart) {
        return res.status(404).json({ message: 'carrito no encontrado' });
    }
    const product = products.find((p) => p.id === Number(pid));
    if (!product) {
        return res.status(404).json({ message: 'producto no encontrado' });
    }
    const cartProduct = cart.products.find((p) => p.product === Number(pid));
    if (cartProduct) {
        cartProduct.quantity += 1;
    } else {
        cart.products.push({ product: Number(pid), quantity: 1 });
    }
    writeCarts(carts);
    return res.status(201).json(cart);
};

module.exports = {
    readCarts,
    writeCarts,
    generateNewCartId,
    addNewCart,
    getProductsByCartId,
    addProductToCart,
};
