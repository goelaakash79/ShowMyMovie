var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index");
});

// INDEX
app.get("/movies", function(req, res) {
  res.render("index");
});

// SEARCH
app.get("/movies/results", function(req, res) {
  var movie = req.query.movie;
  var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + movie;
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.render("results", {
        data: data
      });
    }
  });
});

// SHOW
app.get("/movies/show/:id", function(req, res) {
  var movieId = req.params.id;
  let datalinks;
  let urldata;
  var url = "http://www.omdbapi.com/?apikey=thewdb&plot=full&i=" + movieId;

  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var data = JSON.parse(body);

      var pptMovieUrl = 'https://tv-v2.api-fetch.website/movie/' + movieId;
      var pptShowUrl = 'https://tv-v2.api-fetch.website/show/' + movieId;

      if (data['Type'] === 'movie') {
        request(pptMovieUrl, function(err, response, body) {
          if (!err && response.statusCode == 200) {
            if (body) {
              datalinks = JSON.parse(body);
              urldata = datalinks['torrents']['en'];

              res.render("show", {
                data: data,
                urldata: urldata,
                msg: "movielinksavail"
              });
            } else {
              res.render("show", {
                data: data,
                msg: "movielinksnoavail"
              });
            }
          }
        });
      } else if (data['Type'] === 'series') {
        // request(pptShowUrl, function(err, response, body) {
        // if (!err && response.statusCode == 200) {
        // if (body) {
        // datalinks = JSON.parse(body);
        // urldata = datalinks['episodes'];
        res.render("show", {
          data: data,
          // urldata: urldata,
          msg: "noserieslinks"
        });
      }
    }
  });
});

app.get("/recommended", function(req, res) {
  res.render("recommended");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("*", function(req, res) {
  res.render("404page");
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("Server is running");
});
