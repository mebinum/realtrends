var express = require('express');
var router = express.Router();

/* Setup to serve static files */

var serveStatic = function (app) {
	app.use(express.static(path.join('public')));

	// catch 404 and forward to error handler
    app.use('*', function (req, res) {
        res.sendFile('public/index.html', {
            root: '.'
        });
    });

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = serveStatic;
