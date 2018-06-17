var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("index");
});

// INDEX
app.get("/movies", function(req, res){
    res.render("index");
});

// SEARCH
app.get("/movies/results", function(req, res) {
    var movie = req.query.movie;
    var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + movie;
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("results", {data: data});
        }
    });
});

// SHOW
app.get("/movies/show/:id", function(req, res) {
    var movieId = req.params.id;
    console.log(movieId);
    var url = "http://www.omdbapi.com/?apikey=thewdb&plot=full&i=" + movieId;
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            var data = JSON.parse(body);
            console.log(data["Title"]);
            res.render("show", {data: data});
        }
    });
});

app.get("*", function(req, res){
    res.render("404page");
});

app.listen("1234", process.env.IP, function(){
    console.log("Server is running");
});
