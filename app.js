const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const socket = require('socket.io');

var index = require('./routes/index');
var users = require('./routes/users');

// App Set-Up
var app = express();
var server = app.listen(7000, ()=>{
  console.log('Connected on port 7000');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//Socket Set-up
var io = socket(server);

io.on('connection', (socket)=>{
  console.log(`Connected to client ${socket.id}`);

  socket.on('live-chat', (response)=>{
     io.sockets.emit('live-chat', response);
    console.log('Server recieved message')
    console.log(`${response.username}: ${response.message}`)
  });

  socket.on('typing', (response)=>{
      socket.broadcast.emit('typing', response);
  })
});



module.exports = app;
