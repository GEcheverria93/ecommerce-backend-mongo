const ProductService = require('../services/productService');
const CartService = require('../services/cartService');

class ViewController {
    async renderHome(req, res) {
        try {
            const result = await ProductService.getAllProducts(req.query);
            res.render('home', {
                products: result.payload,
                title: 'Tienda',
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                limit: req.query.limit || 10,
                page: req.query.page || 1,
                sort: req.query.sort || '',
                query: req.query.query || '',
                user: req.user,
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).render('error', {
                error: 'Error al cargar productos',
            });
        }
    }

    async renderCarts(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const result = await CartService.getAllCarts({ page, limit });

            const formattedCarts = result.map((cart) => ({
                id: cart.id,
                products: cart.products.map((item) => ({
                    product: {
                        id: item.product._id,
                        title: item.product.title,
                        price: item.product.price,
                    },
                    quantity: item.quantity,
                })),
            }));

            res.render('carts', {
                title: 'Carritos de Compras',
                carts: formattedCarts,
                currentPage: page,
                totalPages: Math.ceil(result.length / limit),
                user: req.user,
                helpers: {
                    calculateTotal(products) {
                        return products.reduce(
                            (total, item) =>
                                total + item.product.price * item.quantity,
                            0
                        );
                    },
                },
            });
        } catch (error) {
            console.error('Error al obtener carritos:', error);
            res.status(500).render('error', {
                error: 'Error al cargar carritos',
            });
        }
    }

    renderLogin(req, res) {
        if (req.user) {
            return res.redirect('/');
        }
        const returnTo = req.query.returnTo || '/';
        res.render('login', {
            title: 'Iniciar Sesión',
            returnTo,
        });
    }

    renderRegister(req, res) {
        if (req.user) {
            return res.redirect('/profile');
        }
        res.render('register', { title: 'Registro' });
    }

    renderProfile(req, res) {
        res.render('profile', {
            title: 'Perfil',
            user: req.user,
        });
    }

    renderError(req, res) {
        res.render('error', {
            title: 'Error',
            error: req.query.message || 'Ha ocurrido un error',
        });
    }
}

module.exports = new ViewController();
