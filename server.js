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
    db.addNewMovie(req.body).then(()=>{
        res.status(200).send("New Movie Added Successfully");
    }).catch((err)=>{
        res.status(500).send(`Movie Wasnt added successfully : ` + {err});
    })
});

app.get('/api/movies', (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
        if(data.length == 0)
        {
            res.status(404).json({error : "Unable to find requested movie"});
        }
        else
        {
            res.status(200).json("Returned the requested movies by page, perPage, title : " + data);
        }
    }).catch((err)=>{
        res.status(500).send(`Unable to return movies : ` + {err});
    })
});

app.get('/api/movies/:_id', (req, res) => {
    db.getMovieById(req.params._id).then((data)=>{
        res.status(200).json("Returned the requested movie by id : " + data);
    }).catch((err)=>{
        res.status(500).send(`Unable to return movie by requested id : ` + {err});
    })
});

app.put('/api/movies/:_id', (req, res) => {
    db.updateMovieById(req.body, req.params._id).then(()=>{
        res.status(200).send(`Updated the requested movie of id : ` + req.params._id);
    }).catch((err)=>{
        res.status(500).send(`Unable to update movie by requested id : ` + {err});
    })
});


app.delete('/api/movies/:_id', (req, res) => {
    db.deleteMovieById(req.params._id)
    .then(()=>{
        res.status(200).send(`Deleted the requested movie of id : ` + req.params._id);
    })
    .catch((err)=>{
        res.status(500).send(`Unable to delete movie by requested id : ` + {err});
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