const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport');

function generateJWTToken(user) {
    return jwt.sign(user, jwtSecret,
        {
            subject: user.name,
            expiresIn: '7d',
            algorithm: 'HS256'
        });
}

module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    info,
                    user
                });
            }
            return req.login(user, { session: false }, (error) => {
                if (error) {
                    return res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                let { password, ...userData } = user._doc;
                return res.json({ userData, token });
            });
        })(req, res);
    });
};
