const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/:pid', ProductController.getProduct);
router.post('/', ProductController.addNewProduct);
router.put('/:pid', ProductController.updateProduct);
router.delete('/:pid', ProductController.deleteProduct);

module.exports = router;
