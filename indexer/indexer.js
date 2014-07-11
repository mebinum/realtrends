// Load the fs (filesystem) module
var fs = require('fs');
 
// Read the contents of the file into memory.
fs.readFile('keys_data.csv', function (err, keys_table) {
 
// If an error occurred, throwing it will
  // display the exception and end our app.
  if (err) throw err;
 
// logData is a Buffer, convert to string.
  var keys = keys_table.toString();
  var lines = text.split('\n');

  var results = {};
  // Break up the file into lines.
  var lines = text.split('\n');

  lines.forEach(function(line) {
	    var parts = line.split(',');
	    var letter = parts[1];
	    var count = parseInt(parts[2]);
	});
	 
	console.log(results);
	  // { A: 2, B: 14, C: 6 }
	});
});