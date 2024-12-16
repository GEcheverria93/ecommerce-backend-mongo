// Importación del factory para los DAOs
const DAOFactory = require('../daos/factory');

// Obtención de la instancia del DAO de productos
const productDao = DAOFactory.getProductDAO();

class ProductService {
    constructor() {
        // Inicialización del DAO de productos en el constructor
        this.productDao = DAOFactory.getProductDAO();
    }

    // Método para obtener todos los productos con opciones de filtrado y paginación
    async getAllProducts(options = {}) {
        // Desestructuración de opciones con valores por defecto
        const { limit = 10, page = 1, sort: sortOption, query = '' } = options;

        // Construcción del objeto de filtros
        const filters = {};
        if (query) {
            // Si hay query, se añade filtro de categoría con expresión regular
            filters.category = { $regex: new RegExp(query, 'i') };
        }

        // Construcción del objeto de ordenamiento
        const sort = {};
        if (sortOption === 'asc') {
            // Ordenamiento ascendente por precio
            sort.price = 1;
        } else if (sortOption === 'desc') {
            // Ordenamiento descendente por precio
            sort.price = -1;
        }

        // Obtención de productos con los filtros aplicados
        const result = await this.productDao.getAll({
            limit: parseInt(limit, 10), // Conversión a número
            page: parseInt(page, 10), // Conversión a número
            sort, // Objeto de ordenamiento
            filters, // Objeto de filtros
        });

        // Retorno de objeto con información de paginación y productos
        return {
            payload: result.products, // Lista de productos
            totalPages: result.totalPages, // Total de páginas
            prevPage: page > 1 ? parseInt(page, 10) - 1 : null, // Página anterior
            nextPage: page < result.totalPages ? parseInt(page, 10) + 1 : null, // Página siguiente
            page: parseInt(page, 10), // Página actual
            hasPrevPage: page > 1, // Indicador de página anterior
            hasNextPage: page < result.totalPages, // Indicador de página siguiente
        };
    }

    // Método para obtener un producto por su ID
    async getProductById(id) {
        return productDao.getById(id);
    }

    // Método para crear un nuevo producto
    async createProduct(productData) {
        return productDao.create(productData);
    }

    // Método para actualizar un producto existente
    async updateProduct(id, productData) {
        return productDao.update(id, productData);
    }

    // Método para eliminar un producto
    async deleteProduct(id) {
        return productDao.delete(id);
    }
}

// Exportación de una instancia del servicio
module.exports = new ProductService();
