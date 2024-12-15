const ProductDTO = require('../../dtos/productDto');
const Product = require('./models/productModel');

class ProductDAO {
    async getAll(options = {}) {
        const { limit = 10, page = 1, sort = {}, filters = {} } = options;

        const skip = (page - 1) * limit;

        const products = await Product.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filters);

        return {
            products: products.map((product) => new ProductDTO(product)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getById(id) {
        const product = await Product.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async create(productData) {
        const product = await Product.create(productData);
        return new ProductDTO(product);
    }

    async update(id, productData) {
        const product = await Product.findByIdAndUpdate(id, productData, {
            new: true,
        });
        return product ? new ProductDTO(product) : null;
    }

    async delete(id) {
        const product = await Product.findByIdAndDelete(id);
        return product ? new ProductDTO(product) : null;
    }
}

module.exports = ProductDAO;
