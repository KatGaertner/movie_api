/* eslint-disable quote-props */
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const port = 8080;

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://127.0.0.1:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Some text response');
});

app.get('/movies', (req, res) => {
    Movies.find().then((movies) => res.json(movies));
});

app.get('/movies/:title', (req, res) => {
    Movies.find({ 'title': req.params.title }).then((movie) => res.json(movie));
});

app.get('/genres/:genre', (req, res) => {
    Genres.find({ 'name': req.params.genre }).then((genre) => res.json(genre));
});

app.get('/directors/:director', (req, res) => {
    Directors.find({ 'name': req.params.director }).then((director) => res.json(director));
});

app.post('/users', (req, res) => {
    let newUser = req.body;
    Users.findOne({ 'name': newUser.name })
        .then((user) => {
            if (user) {
                res.status(400).send('Name ' + newUser.name + ' already taken.');
            } else {
                Users.create({
                    name: newUser.name,
                    password: newUser.password,
                    email: newUser.email,
                    birthday: newUser.birthday
                })
                    .then((user) => res.status(201).json(user))
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

app.put('/users/:id', (req, res) => {
    let userID = req.params.id;
    let data = req.body;
    Users.findOneAndUpdate(
        { _id: userID },
        {
            $set: {
                'name': data.name,
                'password': data.password,
                'email': data.email,
                'birthday': data.birthday
            }
        },
        { new: true }) // to return updated document
        .then((updatedUser) => {
            if (!updatedUser) {
                res.status(400).send('User not found.');
            } else {
                res.status(200).json(updatedUser);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error: ' + error);
        });
});

app.post('/users/:userid/movies/:movieid', (req, res) => {
    let userID = req.params.userid;
    let movieID = req.params.movieid;
    Users.findOneAndUpdate(
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

app.delete('/users/:userid/movies/:movieid', (req, res) => {
    let userID = req.params.userid;
    let movieID = req.params.movieid;
    Users.findOneAndUpdate(
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

app.delete('/users/:id', (req, res) => {
    let userID = req.params.id;
    Users.findOneAndRemove({ _id: userID })
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

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
