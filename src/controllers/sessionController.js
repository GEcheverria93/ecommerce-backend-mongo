const SessionService = require('../services/sessionService');

class SessionController {
    async register(req, res) {
        try {
            const user = await SessionService.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({
                message: 'Error en el registro',
                error: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await SessionService.login(email, password);

            res.cookie('jwt', result.token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 24 horas
            });

            res.json(result);
        } catch (error) {
            res.status(401).json({
                message: 'Error en el login',
                error: error.message,
            });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('jwt');
            res.json({ message: 'Logout exitoso' });
        } catch (error) {
            res.status(500).json({
                message: 'Error en el logout',
                error: error.message,
            });
        }
    }

    async getCurrentUser(req, res) {
        try {
            const user = await SessionService.getCurrentUser(req.user.id);
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener usuario actual',
                error: error.message,
            });
        }
    }
}

module.exports = new SessionController();
