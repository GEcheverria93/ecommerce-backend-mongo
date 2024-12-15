const passport = require('passport');

const authenticateToken = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                message: 'Error de autenticación',
                error: err.message,
            });
        }
        if (!user) {
            const isApiRequest =
                req.xhr ||
                req.headers.accept?.includes('application/json') ||
                req.path.startsWith('/api/');

            if (isApiRequest) {
                return res.status(401).json({
                    message: 'No autorizado',
                    error: info?.message,
                });
            }
            const returnTo = encodeURIComponent(req.originalUrl);
            return res.redirect(`/login?returnTo=${returnTo}`);
        }
        req.user = user;
        next();
    })(req, res, next);
};

const authorizeRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            message: 'No tienes permisos para realizar esta acción',
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    authorizeRole,
};
