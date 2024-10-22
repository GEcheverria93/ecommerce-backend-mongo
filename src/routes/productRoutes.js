const express = require('express');
const {
    getAllProducts,
    getProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
} = require('../services/productService');

const router = express.Router();

// Ruta para obtener todos los productos con paginación y filtrado
router.get('/', async (req, res) => {
    try {
        const result = await getAllProducts(req, res); // Llama a la función que maneja la lógica de paginación y filtrado
        return res.json(result); // Devuelve el resultado en formato JSON
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res
            .status(500)
            .json({ message: 'Error al obtener productos', error });
    }
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', getProduct);

// Ruta para agregar un nuevo producto
router.post('/', addNewProduct);

// Ruta para actualizar un producto existente
router.put('/:pid', updateProduct);

// Ruta para eliminar un producto
router.delete('/:pid', deleteProduct);

module.exports = router;
