/* eslint-disable node/no-unsupported-features/es-syntax */
const fS = require('fs');
const path = require('path');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

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

const addNewCart = async (req, res) => {
    const { products } = req.body;
    const newCart = new Cart({ products: products || [] });

    try {
        const savedCart = await newCart.save();
        return res.status(201).json(savedCart);
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Error al agregar el carrito', error });
    }
};

const getProductsByCartId = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        return res.json(cart.products);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener los productos del carrito',
            error,
        });
    }
};

const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const cartProduct = cart.products.find(
            (p) => p.product.toString() === pid
        );
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return res.status(201).json(cart);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar el producto al carrito',
            error,
        });
    }
};

module.exports = {
    readCarts,
    writeCarts,
    generateNewCartId,
    addNewCart,
    getProductsByCartId,
    addProductToCart,
};
