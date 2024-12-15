// Importación de módulos necesarios
const express = require('express'); // Importa el módulo express para crear rutas
const SessionController = require('../controllers/sessionController'); // Importa el controlador de sesiones
const { authenticateToken } = require('../middlewares/auth'); // Importa el middleware para autenticar tokens

// Creación del router de Express
const router = express.Router();

// Definición de rutas para la gestión de sesiones

// POST /register - Ruta para registrar un nuevo usuario
router.post('/register', SessionController.register);

// POST /login - Ruta para iniciar sesión de un usuario
router.post('/login', SessionController.login);

// POST /logout - Ruta para cerrar sesión de un usuario
router.post('/logout', SessionController.logout);

// GET /current - Ruta para obtener la información del usuario actual
// Se utiliza el middleware authenticateToken para verificar el token de sesión
router.get('/current', authenticateToken, SessionController.getCurrentUser);

// Exportar el router para su uso en la aplicación
module.exports = router;
