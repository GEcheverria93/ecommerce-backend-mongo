/* eslint-disable node/no-unsupported-features/es-syntax */
const fS = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const readProducts = () => {
    const data = fS.readFileSync(productsFilePath, 'utf-8');

    return JSON.parse(data);
};

const writeProducts = (products) => {
    fS.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const generateNewProductId = (products) =>
    Math.max(...products.map((p) => Number(p.id)), 0) + 1;

const getAllProducts = (req, res) => {
    const products = readProducts();
    const limit = parseInt(req.query.limit, 10);
    // eslint-disable-next-line no-restricted-globals
    if (limit && !isNaN(limit)) {
        return res.json(products.slice(0, limit));
    }
    return res.json(products);
};

const getProduct = (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const product = products.find((p) => p.id === Number(pid));
    if (!product) {
        return res.status(404).json({ message: 'producto no encontrado' });
    }
    return res.json(product);
};

const addNewProduct = (req, res) => {
    const products = readProducts();
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body;
    const newProduct = {
        id: generateNewProductId(products),
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails,
    };

    // Validación de campos obligatorios
    if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.code ||
        newProduct.price == null ||
        newProduct.stock == null ||
        !newProduct.category
    ) {
        return res.status(400).json({
            message: 'Todos los campos excepto thumbnails son obligatorios',
        });
    }
    products.push(newProduct);
    writeProducts(products);

    return res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const index = products.findIndex((p) => p.id === Number(pid));
    if (index === -1) {
        return res.status(404).json({ message: 'producto no encontrado' });
    }
    const updatedProduct = {
        ...products[index],
        ...req.body,
        id: products[index].id,
    };

    products[index] = updatedProduct;
    writeProducts(products);
    return res.json(updatedProduct);
};

const deleteProduct = (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const filteredProducts = products.filter((p) => p.id !== Number(pid));

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ message: 'producto no encontrado' });
    }
    writeProducts(filteredProducts);
    return res.status(204).send();
};

module.exports = {
    readProducts,
    getAllProducts,
    getProduct,
    addNewProduct,
    writeProducts,
    generateNewProductId,
    updateProduct,
    deleteProduct,
};
