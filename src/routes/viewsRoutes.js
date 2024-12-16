const express = require('express');
const ViewController = require('../controllers/viewController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas públicas
router.get('/login', ViewController.renderLogin);
router.get('/register', ViewController.renderRegister);
router.get('/error', ViewController.renderError);

// Middleware de autenticación para todas las rutas protegidas
router.use(authenticateToken);

// Rutas protegidas
router.get('/', ViewController.renderHome);
router.get('/profile', ViewController.renderProfile);
router.get('/carts', ViewController.renderCarts);

module.exports = router;
