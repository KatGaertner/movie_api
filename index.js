const express = require('express');
const morgan = require('morgan');
const port = 8080;

const bestMovies = [
    {
        name: 'Sample - The Movie',
        producer: 'Filmmaker Guy'
    },
    {
        name: 'Sample 2: Electric Boogaloo',
        producer: 'Filmmaker Guy'
    }
];


const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Some text response');
});

app.get('/movies', (req, res) => {
    res.json(bestMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
