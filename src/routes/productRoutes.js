const express = require('express');
const {
    getAllProducts,
    getProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
} = require('../services/productService');

const router = express.Router();

router.get('/', getAllProducts);

router.get('/:pid', getProduct);

router.post('/', addNewProduct);

router.put('/:pid', updateProduct);

router.delete('/:pid', deleteProduct);

module.exports = router;
