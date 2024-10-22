/* eslint-disable node/no-unsupported-features/es-syntax */
const fS = require('fs');
const path = require('path');
const Product = require('../models/product.model');

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

const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10; // Establecer un límite por defecto
        const page = parseInt(req.query.page, 10) || 1; // Establecer una página por defecto

        // Calcular el número de documentos a omitir
        const skip = (page - 1) * limit;

        // Inicializar el objeto de filtros
        const filters = {};

        // Aplicar filtro por categoría si se proporciona
        if (req.query.query) {
            filters.category = { $regex: new RegExp(req.query.query, 'i') }; // Insensible a mayúsculas
        }

        // Inicializar el objeto de ordenamiento
        const sort = {};
        if (req.query.sort === 'asc') {
            sort.price = 1; // Ordenar ascendentemente por precio
        } else if (req.query.sort === 'desc') {
            sort.price = -1; // Ordenar descendentemente por precio
        }

        // Obtener todos los productos con paginación, filtros y ordenamiento
        const products = await Product.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalDocs = await Product.countDocuments(filters); // Contar el total de documentos con filtros

        const totalPages = Math.ceil(totalDocs / limit); // Calcular el total de páginas

        const response = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
        };

        return response; // Devuelve la respuesta en el formato requerido
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error; // Lanza el error para que pueda ser manejado en el enrutador
    }
};

const getProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.json(product);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error al obtener el producto', error });
    }
};

const addNewProduct = async (req, res) => {
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
    const newProduct = new Product({
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails,
    });

    try {
        const savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Error al agregar el producto', error });
    }
};

const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
            new: true,
        });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.json(updatedProduct);
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Error al actualizar el producto', error });
    }
};

const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.status(204).send();
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error al eliminar el producto', error });
    }
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
