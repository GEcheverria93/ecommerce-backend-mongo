const DAOFactory = require('../daos/factory');

const productDao = DAOFactory.getProductDAO();

class ProductService {
    constructor() {
        this.productDao = DAOFactory.getProductDAO();
    }

    async getAllProducts(options = {}) {
        const { limit = 10, page = 1, sort: sortOption, query = '' } = options;

        // Construir objeto de filtros
        const filters = {};
        if (query) {
            filters.category = { $regex: new RegExp(query, 'i') };
        }

        // Construir objeto de ordenamiento
        const sort = {};
        if (sortOption === 'asc') {
            sort.price = 1;
        } else if (sortOption === 'desc') {
            sort.price = -1;
        }

        const result = await this.productDao.getAll({
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort,
            filters,
        });

        return {
            payload: result.products,
            totalPages: result.totalPages,
            prevPage: page > 1 ? parseInt(page, 10) - 1 : null,
            nextPage: page < result.totalPages ? parseInt(page, 10) + 1 : null,
            page: parseInt(page, 10),
            hasPrevPage: page > 1,
            hasNextPage: page < result.totalPages,
        };
    }

    async getProductById(id) {
        return productDao.getById(id);
    }

    async createProduct(productData) {
        return productDao.create(productData);
    }

    async updateProduct(id, productData) {
        return productDao.update(id, productData);
    }

    async deleteProduct(id) {
        return productDao.delete(id);
    }
}

module.exports = new ProductService();
