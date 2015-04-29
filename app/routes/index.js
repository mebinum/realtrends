var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* Setup to serve static files */

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//app.use(express.static(path.join('public')));




// router.use('/js', express.static(path.join(__dirname, 'public/js')));
// router.use('/vendor', express.static(path.join(__dirname, 'public/vendor')));



//catch 404 and forward to error handler
router.use('*', function (req, res) {
    res.sendFile('public/index.html', {
        root: '.'
    });
});

router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = router;
