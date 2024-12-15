// Importaciones necesarias
const express = require('express');
const ProductController = require('../controllers/productController');

// Creación del router de Express
const router = express.Router();

// Definición de rutas para productos

// GET / - Obtener todos los productos con opciones de filtrado y paginación
router.get('/', ProductController.getAllProducts);

// GET /:pid - Obtener un producto específico por ID
router.get('/:pid', ProductController.getProduct);

// POST / - Crear un nuevo producto
router.post('/', ProductController.addNewProduct);

// PUT /:pid - Actualizar un producto existente
router.put('/:pid', ProductController.updateProduct);

// DELETE /:pid - Eliminar un producto
router.delete('/:pid', ProductController.deleteProduct);

// Exportar el router
module.exports = router;
