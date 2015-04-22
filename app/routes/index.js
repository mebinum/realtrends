var express = require('express');
var router = express.Router();

/* Setup to serve static files */

var serveStatic = function (app) {
	app.use(express.static(path.join('public')));

	// app.use('/js/script.js',function(req, res){
	// 	fs.readFileSync(__dirname + '/public' + file, 'utf8');
	// 	var REALTRENDZ_ES_SERVER = process.env.REALTRENDZ_ES_SERVER;
	// 	var REALTRENDZ_ES_INDEX = process.env.REALTRENDZ_ES_INDEX;
	// 	var REALTRENDZ_ES_MAPPING = process.env.REALTRENDZ_ES_MAPPING;

	// 	var serverUrlString = 'var serverUrl = \''+ REALTRENDZ_ES_SERVER + '/' + REALTRENDZ_ES_INDEX+'/_search?\'';
	// 	serverUrlString +='\nvar searchIndex = \''+ REALTRENDZ_ES_MAPPING + '\';';
	// });
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
