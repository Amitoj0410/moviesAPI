// Setup
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const path = require('path');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.json({message : "API Listening"});
});

app.post('/api/movies', (req, res) => {
    // MUST return HTTP 201
    db.addNewMovie(req.body)
    .then(()=>{
        res.status(201).send("New Movie Added Successfully");
    })
    .catch((err)=>{
        res.status(500).send(`Movie Wasnt added successfully : ` + {err});
    })
});

app.get('/api/movies', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then(()=>{
        res.status(201).send("Returned the requested movies");
    })
    .catch((err)=>{
        res.status(500).send(`Unable to return movies :` + {err});
    })
});

// Tell the app to start listening for requests
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
        //console.log(process.env.MONGODB_CONN_STRING);
    });
}).catch((err)=>{
    console.log(err);
});

// app.listen(HTTP_PORT, () => {
//     console.log('Ready to handle requests on port ' + HTTP_PORT);
//     console.log(process.env.MONGODB_CONN_STRING);
// });
