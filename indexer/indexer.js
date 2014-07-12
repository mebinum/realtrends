// Load the fs (filesystem) module
var fs = require('fs');
var _ = require('underscore');
var Converter = require("csvtojson").core.Converter;
var http = require('http');
var elasticsearch = require('elasticsearch');

var fileStream = fs.createReadStream('keys_data.csv');

var esclient = new elasticsearch.Client({
  host: 'https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io'
});

var csvConverter = new Converter({
	constructResult: true
});

var mappings = [];
var getFormat = function (format) {

	if(typeof format !== 'undefined') {
		var og = format;
		format = og.toLowerCase();

		if (format.indexOf('dd') > -1 || format.indexOf('mm') > -1 || format.indexOf('yy') > -1) {
			return 'date';
		}

		if (format.indexOf('integer') > -1) {
			return 'integer';
		}
	}

	return 'string';
};


//end_parsed will be emitted once parsing finished
csvConverter.on("end_parsed", function(jsonObj) {
	var valid = _.filter(jsonObj,function (val) {
		return !_.isUndefined(val.key_name);
	});
	var map = {'properties':{}};
	_.each(valid, function(value) {
		var type = getFormat(value.format);
		map.properties[value.key_name] = {'type': type};
		if(type === 'date') {
			map.properties[value.key_name] = {'format': value.format};
		}
	});
	map.properties.postcode_geocode = {'type': 'geo_point', 'store': true};
	esclient.indices.putMapping({
		index:'building_data',
		type: 'permit',
		properties: map.properties
	}).then(function (data) {
		console.log(data);
		console.log('it worked');
	},function  (err) {
		console.log(err);
		console.log('it failed');
	});

	console.log(JSON.stringify(map));
});

// var permit = {}
//read from file
fileStream.pipe(csvConverter);

// // Read the contents of the file into memory.
// fs.readFile('keys_data.csv', function(err, keys_table) {

// 	// If an error occurred, throwing it will
// 	// display the exception and end our app.
// 	if (err) throw err;

// 	// logData is a Buffer, convert to string.
// 	var keys = keys_table.toString();
// 	// Break up the file into lines.
// 	var lines = keys.split('\r');
// 	console.log(_.groupBy(keys,function (k) {
// 		return k === '\r';
// 	}));
// 	var columns = lines[0].split(',');
// 	var results = {};

// 	lines.forEach(function(line, i) {
// 		if (i !== 0) {
// 			var parts = line.split(',');
// 			columns.forEach(function(columnName, j) {
// 				results[columnName] = parts[j];
// 			});
// 		}
// 	});
// 	console.log(results);
// });