var fs = require('fs');
var _ = require('underscore');
var elasticsearch = require('elasticsearch');
var Converter = require("csvtojson").core.Converter;
var mappings = JSON.parse(fs.readFileSync('mappings.json', 'utf8'));

var keys = _.keys(mappings.properties);
var fileStream = fs.createReadStream('all_years.csv');
var wsStream = fs.createWriteStream("response.txt");

var latLongString = fs.readFileSync('pc_full_lat_long.csv').toString();
//read from file
var postJSON = {};

var esclient = new elasticsearch.Client({
	host: 'https://cydupqgzpx:p19ndm9l1a@realtrends-9107882958.eu-west-1.bonsai.io'
});

var strConvert = new Converter({
	constructResult: true
});

var csvConverter = new Converter({
	constructResult: true
});

var esIndex = 'building_data';
var esType = 'permits';
var defLongLat = [0, 0];

var getPostCodeLocation = function(postcode) {
	if (_.isUndefined(postcode)) {
		return defLongLat;
	}
	// Pcode,"Lat","Long"
	var pObj = _.filter(postJSON, function(val) {
		return val.Pcode === postcode;
	});

	if (pObj.length === 0) {
		return defLongLat;
	}
	var lng = pObj[0]['Long'];
	var lat = pObj[0]['Lat'];
	return [lng, lat];
};

var esCallback = function(err, response) {
	if (err) {
		console.log('it failed');
		console.log(err);
		return;
	}
	console.log('document was updated or created');
	console.log(response);
};

var sendToEs = function(value, i) {
	var body = {};
	//map each permit to a key
	_.each(keys, function(k) {
		body[k] = value[k];
	});
	var postcodeCoords = getPostCodeLocation(body.site_pcode);

	if (!_.isEqual(defLongLat, postcodeCoords)) {
		body.geo_point = postcodeCoords;
	}

	esclient.index({
		index: esIndex,
		type: esType,
		id: i,
		body: body
	}, esCallback);
};

var bulkBody = [];
var requests = '';

var buildBulk = function(value, i) {
	var body = {};
	//map each permit to a key
	_.each(keys, function(k) {
		body[k] = value[k];
	});
	var postcodeCoords = getPostCodeLocation(body.site_pcode);

	//if (!_.isEqual(defLongLat, postcodeCoords)) {
	body.geo_point = postcodeCoords;
	//}
	var index = JSON.stringify({
		index: {
			_index: esIndex,
			_type: esType,
			_id: i
		}
	});

	wsStream.write(index);
	wsStream.write(JSON.stringify(body));
};

csvConverter.on("record_parsed", function(resultRow, rawRow, rowIndex) {
	buildBulk(resultRow, rowIndex);
	//setTimeout(sendToEs(resultRow,rowIndex),500);
});

//end_parsed will be emitted once parsing finished
csvConverter.on("end_parsed", function(jsonObj) {
	console.log('pares ended');
	wsStream.end();
	// console.log(bulkBody);

	// client.bulk({
	// 	body: bulkBody
	// }, esCallback);
});

// var permit = {}

strConvert.fromString(latLongString, function(err, jsonObj) {
	//postJSON = jsonObj;
	var postcodes = {};
	_.each(jsonObj,function (val) {
		var lng = val['Long'];
		var lat = val['Lat'];
		postcodes[val.Pcode] = [lng, lat];
	});
	var stream = fs.createWriteStream("postcodes.json");
	stream.once('open',function() {
		stream.write(JSON.stringify(postcodes));
		stream.end();
	});
});
//