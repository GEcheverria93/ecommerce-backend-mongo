const ProductService = require('../services/productService');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const result = await ProductService.getAllProducts(req.query);
            res.json(result);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                message: 'Error al obtener productos',
                error: error.message,
            });
        }
    }

    async getProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductService.getProductById(pid);
            if (!product) {
                return res
                    .status(404)
                    .json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener el producto',
                error: error.message,
            });
        }
    }

    async addNewProduct(req, res) {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({
                message: 'Error al agregar el producto',
                error: error.message,
            });
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updatedProduct = await ProductService.updateProduct(
                pid,
                req.body
            );
            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ message: 'Producto no encontrado' });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(400).json({
                message: 'Error al actualizar el producto',
                error: error.message,
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const result = await ProductService.deleteProduct(pid);
            if (!result) {
                return res
                    .status(404)
                    .json({ message: 'Producto no encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar el producto',
                error: error.message,
            });
        }
    }
}

module.exports = new ProductController();
