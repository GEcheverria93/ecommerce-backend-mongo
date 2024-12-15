const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../daos/mongodb/models/userModel');

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.jwt;
    }
    return token;
};

const initializePassport = () => {
    passport.use(
        'jwt',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: process.env.JWT_SECRET,
            },
            async (jwtPayload, done) => {
                try {
                    const user = await User.findById(jwtPayload.sub);
                    if (!user) {
                        return done(null, false, {
                            message: 'Usuario no encontrado',
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

module.exports = initializePassport;
