# movieAPI

A RESTful API that will provide interaction with a movie database and a user database. The API offers endpoints for information on movies, directors and genres, as well as interactions with a user database, like signing up, logging in and changing user data. All endpoints and functions are listed in [the overview](#Overview-of-the-Endpoints).

The API is currently deployed on Heroku and will be used in the [myFlix App](https://github.com/KatGaertner/myFlix).

# Technologies

The project utilizes:
- Node.js and npm
- Express.js
- MongoDB and Mongoose ODM
- Passport with JWT
- express-validator
- MongoDB Atlas for hosting the database
- Heroku for deployment of the API

# Overview of the Endpoints

| Method   | URL endpoint                         | Description                                     |
|----------|--------------------------------------|-------------------------------------------------|
|  GET     | /movies                              | returns a list of all movies                    |
|  GET     | /movies/\[title\]                    | returns data about a single movie by title      |
|  GET     | /genres/\[name\]                     | returns data about a genre by name              |
|  GET     | /directors/\[name\]                  | returns data about a director by name           |
|  POST    | /users                               | adds a new user                                 |
|  PUT     | /users/\[ID\]                        | updates user data by user ID                    |
|  POST    | /login                               | logs in user                                    |
|  GET     | /users/                              | gets user data based on the user ID in JWT token|
|  POST    | /users/\[userID\]/movies/\[movieID\] | adds a movie to a user's list of favorites      |
|  DELETE  | /users/\[userID\]/movies/\[movieID\] | removes a movie from a user's list of favorites |
|  DELETE  | /users/\[ID\]                        | removes a user by ID                            |

<a name="webpage-cut"></a>
# Project status

This project was made within the scope of a Web Development course as a portfolio project. As such, it is finished for now.
