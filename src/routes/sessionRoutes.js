const express = require('express');
const SessionController = require('../controllers/sessionController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', SessionController.register);
router.post('/login', SessionController.login);
router.post('/logout', SessionController.logout);
router.get('/current', authenticateToken, SessionController.getCurrentUser);

module.exports = router;
