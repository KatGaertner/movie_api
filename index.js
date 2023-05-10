const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const port = 8080;

const movies = [
    {
        title: 'Everything Everywhere All at Once',
        directors: ['Daniel Kwan', 'Daniel Scheinert'],
        genres: ['Action', 'Adventure', 'Comedy']
    },
    {
        title: 'All Quiet on the Western Front',
        directors: ['Edward Berger'],
        genres: ['Action', 'Drama', 'War']
    },
    {
        title: 'Avatar: The Way of Water',
        directors: ['James Cameron'],
        genres: ['Action', 'Adventure', 'Fantasy']
    },
    {
        title: 'The Banshees of Inisherin',
        directors: ['Martin McDonagh'],
        genres: ['Comedy', 'Drama']
    },
    {
        title: 'Elvis',
        directors: ['Baz Luhrmann'],
        genres: ['Biography', 'Drama', 'Musical']
    },
    {
        title: 'The Fabelmans',
        directors: ['Steven Spielberg'],
        genres: ['Drama']
    },
    {
        title: 'Tár',
        directors: ['Todd Field'],
        genres: ['Drama', 'Music']
    },
    {
        title: 'Top Gun: Maverick',
        directors: ['Joseph Kosinski'],
        genres: ['Action', 'Drama']
    },
    {
        title: 'Triangle of Sadness',
        directors: ['Ruben Östlund'],
        genres: ['Comedy', 'Drama']
    },
    {
        title: 'Women Talking',
        directors: ['Sarah Polley'],
        genres: ['Drama']
    }
];

let users = [
    {
        name: 'Alice',
        id: 1234,
        favorites: ['The Banshees of Inisherin']
    },
    {
        name: 'Bob',
        id: 5678,
        favorites: []
    }
];

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Some text response');
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    let movie = movies.find((movie) => movie.title === req.params.title);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found.');
    }
});

app.get('/genres/:genre', (req, res) => {
    res.send('Successful GET request for data on the genre ' + req.params.genre);
});

app.get('/directors/:director', (req, res) => {
    res.send('Successful GET request for data on the director ' + req.params.director);
});

app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        res.status(400).send('Missing name in request body.');
    } else {
        newUser.id = uuid.v4();
        newUser.favorites = [];
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

app.put('/users/:id', (req, res) => {
    let user = users.find((user) => user.id === Number(req.params.id));
    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.send('Successfully PUT updated data for user ' + req.params.id);
    }
});

app.post('/users/:id/movies/:title', (req, res) => {
    let user = users.find((user) => user.id === Number(req.params.id));
    let movie = movies.find((movie) => movie.title === req.params.title);
    if (!user) {
        res.status(404).send('User not found');
    } else if (!movie) {
        res.status(404).send('Movie not found');
    } else {
        user.favorites.push(req.params.title);
        res.status(201).send(user.favorites);
    }
});

app.delete('/users/:id/movies/:title', (req, res) => {
    let user = users.find((user) => user.id === Number(req.params.id));
    let movie = movies.find((movie) => movie.title === req.params.title);

    if (!user) {
        res.status(404).send('User not found');
    } else if (!movie) {
        res.status(404).send('Movie not found');
    } else {
        user.favorites = user.favorites.filter((title) => title !== req.params.title);
        res.status(201).send(user.favorites);
    }
});

app.delete('/users/:id', (req, res) => {
    let user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
        users = users.filter((user) => user.id !== Number(req.params.id));
        res.status(201).send('Successfully DELETEd user ' + req.params.id);
    } else {
        res.status(404).send('User ID not found.');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
