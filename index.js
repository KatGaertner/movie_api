/* eslint-disable quote-props */
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// mongoose.connect('mongodb://127.0.0.1:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
const allowedOrigins = [
    'http://localhost:8080', 'http://localhost:1234', 'https://myflix-27.netlify.app', 'http://localhost:4200', 'https://katgaertner.github.io'
];

app.use(cors(
    {
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.indexOf(origin) === -1) {
                let message = 'The CORS policy for this application doesn\'t allow acces from origin ' + origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        }
    }
));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const authParameter = passport.authenticate('jwt', { session: false });

app.get('/', (req, res) => {
    res.send('Some text response');
});

app.get('/movies', authParameter, (req, res) => {
    Movies.find()
        .then((movies) => res.status(201).json(movies))
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/movies/:title', authParameter, (req, res) => {
    Movies.find({ 'title': req.params.title })
        .then((movie) => res.status(201).json(movie))
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/genres/:genre', authParameter, (req, res) => {
    Genres.find({ 'name': req.params.genre })
        .then((genre) => res.status(201).json(genre))
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/directors/:director', authParameter, (req, res) => {
    Directors.find({ 'name': req.params.director })
        .then((director) => res.status(201).json(director))
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.post('/users',
    [
        check('name', 'Username has to have at least 5 characters.').trim().isLength({ min: 5 }),
        check('name', 'Username can only contain alphanumeric characters.').trim().isAlphanumeric(),
        check('password', 'Password has to have at least 8 characters.').isLength({ min: 8 }),
        check('email', 'Email has to be valid.').trim().isEmail(),
        // checkFalsy: true allows birthday to be "" or null, etc
        check('birthday', 'Birthday has to be valid.').isDate().optional({ checkFalsy: true })
    ],
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let newUser = req.body;
        let hashedPassword = Users.hashPassword(newUser.password);
        return Users.findOne({ 'name': newUser.name })
            .then((user) => {
                if (user) {
                    res.status(400).send('Name ' + newUser.name + ' already taken.');
                } else {
                    Users.create({
                        name: newUser.name,
                        password: hashedPassword,
                        email: newUser.email,
                        birthday: newUser.birthday
                    })
                        .then((user) => {
                            let { password, ...cleanData } = user._doc;
                            res.status(201).json(cleanData);
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send('Error: ' + error);
            });
    });

app.get('/users/', authParameter, (req, res) => {
    Users.find({ _id: req.user.id })
        .then((data) => {
            let { password, ...cleanData } = data[0]._doc;
            res.status(201).json(cleanData);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.put('/users/:id', authParameter,
    [
        check('name', 'Username has to have at least 5 characters.').trim().isLength({ min: 5 }).optional(),
        check('name', 'Username can only contain alphanumeric characters.').trim().isAlphanumeric().optional(),
        check('password', 'Password has to have at least 8 characters.').isLength({ min: 8 }).optional(),
        check('email', 'Email has to be valid.').trim().isEmail().optional(),
        // checkFalsy: true allows birthday to be "" or null, etc
        check('birthday', 'Birthday has to be valid.').isDate().optional({ checkFalsy: true })
    ],
    (req, res) => {
        if (req.user.id !== req.params.id) {
            return res.status(401).send('Unauthorized.');
        }

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let userID = req.params.id;
        let rawData = req.body;

        // only the data included in the request should be updated, but the password must be hashed, if it exists
        let data = { ...rawData, ...(rawData.password ? { password : Users.hashPassword(rawData.password) } : {}) };

        return Users.findOne({ 'name': data.name })
            .then((user) => {
                if (user) {
                    res.status(400).send('Name ' + data.name + ' already taken.');
                } else {
                    Users.findOneAndUpdate(
                        { _id: userID },
                        { $set: data },
                        { new: true }) // to return updated document
                        .then((updatedUser) => {
                            if (!updatedUser) {
                                return res.status(400).send('User not found.');
                            }
                            let { password, ...cleanData } = updatedUser._doc;
                            return res.status(200).json(cleanData);
                        })
                        .catch((error) => {
                            console.log(error);
                            return res.status(500).send('Error: ' + error);
                        });
                }
            });
    });

app.post('/users/:userid/movies/:movieid', authParameter, (req, res) => {
    if (req.user.id !== req.params.userid) {
        return res.status(401).send('Unauthorized.');
    }

    let userID = req.params.userid;
    let movieID = req.params.movieid;
    return Users.findOneAndUpdate(
        { _id: userID },
        {
            $addToSet: { favorites: movieID }
        },
        { new: true })
        .then((user) => {
            if (!user) {
                res.status(400).send('User not found.');
            } else {
                res.status(200).json(user.favorites);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.delete('/users/:userid/movies/:movieid', authParameter, (req, res) => {
    if (req.user.id !== req.params.userid) {
        return res.status(401).send('Unauthorized.');
    }

    let userID = req.params.userid;
    let movieID = req.params.movieid;
    return Users.findOneAndUpdate(
        { _id: userID },
        {
            $pull: { favorites: movieID }
        },
        { new: true })
        .then((user) => {
            if (!user) {
                res.status(400).send('User not found.');
            } else {
                res.status(200).json(user.favorites);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.delete('/users/:id', authParameter, (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(401).send('Unauthorized.');
    }

    let userID = req.params.id;
    return Users.findOneAndRemove({ _id: userID })
        .then((user) => {
            if (!user) {
                res.status(400).send('User not found.');
            } else {
                res.status(200).send('User deleted.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
