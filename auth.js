// In your new “auth.js” file, create a new “/login” endpoint for registered
// users that contains logic for authenticating users with basic HTTP authentication
// and generating a JWT token for authenticating future requests.

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
                    message: 'Something is not right.',
                    user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    return res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
};
