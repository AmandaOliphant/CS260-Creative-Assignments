var express = require('express');
var http = require('http');
var createError = require('http-errors');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.set('port', 8080);
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/public/index.html'));
});

server.listen(8080, function() {
  console.log('Starting server on port 8080');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var players = {};
var rupees = {};
var id = 0;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomRupee() {
  var rupeeOptions = ["green", "green", "green", "green", "green", "green", "green", "green",
    "green", "green", "green", "green", "blue", "blue", "blue", "blue",
    "blue", "blue", "blue", "blue", "blue", "blue", "red", "red", "red", "purple", "purple", "gold"
  ];
  var index = randomIntFromInterval(1, rupeeOptions.length);
  var rupee = rupeeOptions[index];
  if (rupee === "green") {
    return ("images/greenR.png");
  }
  else if (rupee === "blue") {
    return ("images/blueR.jpg");
  }
  else if (rupee === "red") {
    return ("images/redR.jpg");
  }
  else if (rupee === "purple") {
    return ("images/purpleR.jpg");
  }
  else {
    return ("images/goldR.jpg")
  }
}

function playerOnRupee(player) {
  for (var item in rupees) {
    var rupee = rupees[item];
    var xUpper = player.x + 30;
    var xLower = player.x - 30;
    var yUpper = player.y + 30;
    var yLower = player.y - 30;
    if ((rupee.x > xLower) && (rupee.x < xUpper)) {
      if ((rupee.y > yLower) && (rupee.y < yUpper)) {
        var caughtRupee = {
          x: rupee.x,
          y: rupee.y,
          source: rupee.source
        }
        delete rupees[item];
        return caughtRupee;
      }
    }
  }
  return (-1);
}

function getRupeePoints(rupee) {
  var rupeeSource = rupee["source"]

  var pointsEarned = 0;
  if (rupeeSource === "images/greenR.png") {
    pointsEarned = 1;
  }
  else if (rupeeSource === "images/blueR.jpg") {
    pointsEarned = 5;
  }
  else if (rupeeSource === "images/redR.jpg") {
    pointsEarned = 20;
  }
  else if (rupeeSource === "images/purpleR.jpg") {
    pointsEarned = 50;
  }
  else if (rupeeSource === "images/goldR.jpg") {
    pointsEarned = 300;
  }
  else {
    pointsEarned = 1;
  }
  io.sockets.emit('collectedRupee', rupee);
  return (pointsEarned);
}

io.on('connection', function(socket) {
  socket.on('new player', function(data) {
    players[socket.id] = {
      x: 300,
      y: 300,
      color: data["colorDot"],
      nickname: data["nickname"],
      colorName: data["colorName"],
      numPoints: 0
    };
    io.sockets.emit('updateTable', players);
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
      if (player.x < 0) {
        player.x = 795;
      }
    }
    if (data.up) {
      player.y -= 5;
      if (player.y < 0) {
        player.y = 595;
      }
    }
    if (data.right) {
      player.x += 5;
      if (player.x > 800) {
        player.x = 5;
      }
    }
    if (data.down) {
      player.y += 5;
      if (player.y > 600) {
        player.y = 5;
      }
    }
    var rupee = playerOnRupee(player);
    if (rupee != -1) {
      var points = getRupeePoints(rupee);
      player["numPoints"] += points;
      io.sockets.emit('updateTable', players);
    }
  });
  socket.on('disconnect', function(data) {
    delete players[socket.id]
    io.sockets.emit('updateTable', players);
  })
  socket.on('clearRupees', function() {
    rupees = {};
  })
});

setInterval(function() {
  io.sockets.emit('state', players, rupees);
}, 1000 / 60);

setInterval(function() {
  var xval = randomIntFromInterval(20, 780);
  var yval = randomIntFromInterval(20, 580);
  rupees[id] = {
    source: getRandomRupee(),
    x: xval,
    y: yval
  }
  id++;
}, 1500);

setInterval(function() {
  io.sockets.emit('clearRupees');
  rupees = {};
}, 10000)
