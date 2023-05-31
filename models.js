const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    featured: Boolean,
    imageURL: String,
    genres: [
        {
            name: String,
            description: String
        }
    ],
    directors: [
        {
            name: String,
            biography: String,
            birthyear: Number,
            deathyear: Number
        }
    ]
});

let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]
});

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

let genreSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

let directorSchema = mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String, required: true },
    birthyear: { type: Number, required: true },
    deathyear: Number
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
