var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var bodyParser = require("body-parser");

var passport = require('passport');
var passportSetup = require('./config/passport-setup');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.authenticate('remember-me'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//mongo connection
mongoose.connect('mongodb://dbansal:dbansal18@ds259855.mlab.com:59855/rememberme',{ useCreateIndex: true, useNewUrlParser: true}, () => {
    console.log('connected to mongodb');
});
const cookieKey = 'coookkooooo'
// set up session cookies
app.use(cookieSession({
    maxAge: 60 * 60 * 100,
    keys: [cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

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

module.exports = app;
