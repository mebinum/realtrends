var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/js/script.js',function(req, res,next) {
    try {
            var scriptjs = fs.readFileSync(__dirname + '/public/'+'js/script.js', 'utf8');
            var ES_SERVER_PROTOCOL = process.env.ES_SERVER_PROTOCOL ? process.env.ES_SERVER_PROTOCOL : 'http';
            var ES_SERVER_URL = process.env.ES_SERVER_URL;
            console.log('Elastic search server url is ' + ES_SERVER_URL);
            if(ES_SERVER_URL) {
              var serverUrlString = ES_SERVER_PROTOCOL + '://'+ ES_SERVER_URL + '/building_data/_search?';

              var newjs = scriptjs.replace(/var serverUrl = '(.*)';/, function(g) {
                  return 'var serverUrl = \''+ serverUrlString +'\';';
              });
              res.send(newjs);
            }
    } catch (e) {
      // Here you get the error when the file was not found,
      // but you also get any other error
        console.log('=== Error === ');
        console.log(e);
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
