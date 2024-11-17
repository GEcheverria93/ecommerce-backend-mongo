const express = require('express');
const passport = require('passport');
const { register, login } = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await register(req.body);
        res.status(201).json({ status: 'success', user });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await login(email, password);

        // Establecer cookie con el token
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 horas
        });

        res.json({ status: 'success', user });
    } catch (error) {
        res.status(401).json({ status: 'error', error: error.message });
    }
});

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ user: req.user });
    }
);

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ status: 'success', message: 'Logout successful' });
});

module.exports = router;
