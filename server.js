var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var datafile = path.join(__dirname + '/data.json');

app.use('/', express.static('public'));
app.get('/detail', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/detail.html')); //'GET /detail ' + req.query.i);
});

app.get('/addfav', function(req, res) {
    var title = req.query.t;
    var imdbID = req.query.i;

    var data = JSON.parse(fs.readFileSync(datafile));
    if (data == null) {
      data = [];
    }
    var isExisted = function() {
      for (var i=0; i<data.length; i++) {
        if (data[i].Title == title && data[i].imdbID == imdbID) {
          return true;
        }
      }
      return false;
    };

    var str = "<div><a href='/'>Home</a> | <a href='/listfav'>Favorite Movies</a><p/></div>";

    if (!isExisted()) {
      data.push({Title: title, imdbID: imdbID});
      fs.writeFile(datafile, JSON.stringify(data), function(e) {
        if (e) {
          return console.log(e);
        }
        res.send(str + "DONE adding the movie '" + title + "' to the favorite movies list");
      })
    } else {
      res.send(str + "The movie '" + title + "' is already existed in the favorite movies list.");
    }
});

app.get('/listfav', function(req, res) {
    var data = JSON.parse(fs.readFileSync(datafile));
    var str = "<div><a href='/'>Home</a> | <a href='/clearfav'>Clear favorite movies list</a></div>";
    str += "<h1>Favorite Movies List</h1>";
    str += "<ul>";
    for (var i=0; i<data.length; i++) {
      str += "<li><a href='/detail?i=" + data[i].imdbID + "'>" + data[i].Title + "</a></li>";
    }
    str += "</ul>";
    res.send(str);
});

app.get('/clearfav', function(req, res) {
    var data = JSON.parse(fs.readFileSync(datafile));
    var str = "<div><a href='/'>Home</a></div>";
    fs.writeFileSync(datafile, JSON.stringify([]));
    res.send(str + "DONE clearing the favorite movies list");
})

app.listen(3000, function(){
  console.log("Listening on port 3000");
});