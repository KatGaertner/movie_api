# movieAPI

A RESTful API that will provide interaction with a movie database and a user database. The API offers endpoints for information on certain movies, directors and genres, as well as a list of all movies. Users can sign up for an account, log in, add and remove movies from a list of their favorites, as well as change or delete their profile.

# Technologies

The project utilizes:
- Node.js and npm
- Express.js
- MongoDB and Mongoose ODM
- Passport with JWT
- express-validator 

# Overview of the Endpoints

| Method   | URL endpoint                         | Description                                     |
|----------|--------------------------------------|-------------------------------------------------|
|  GET     | /movies                              | returns a list of all movies                    |
|  GET     | /movies/\[title\]                    | returns data about a single movie by title      |
|  GET     | /genres/\[name\]                     | returns data about a genre by name              |
|  GET     | /directors/\[name\]                  | returns data about a director by name           |
|  POST    | /users                               | adds a new user                                 |
|  PUT     | /users/\[ID\]                        | updates user data by user ID                    |
|  POST    | /users/\[userID\]/movies/\[movieID\] | adds a movie to a user's list of favorites      |
|  DELETE  | /users/\[userID\]/movies/\[movieID\] | removes a movie from a user's list of favorites |
|  DELETE  | /users/\[ID\]                        | removes a user by ID                            |

# Project status