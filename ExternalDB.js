var http = require('http')

module.exports = {

	/**
	* Create HTTP Request containing a key value as its data to utilise a 
	* storage service.
	* @pararms { STRING } k - key
	* @params { FUNCTION } callback - function that takes status code and output of request.
	*/
	read: function ( k, callback ) {

		var options = {
			host: 'localhost',
			port: 3000,
			path: '/part1/' + k
		}

		var req = http.get(options, function(res) {

			var bodyChunks = [];
			res.on('data', function(chunk) {
				bodyChunks.push(chunk);
			}).on('end', function() {
				var body = Buffer.concat(bodyChunks);
				callback( res.statusCode, JSON.parse( body ) )
			})
		})

	},

	/**
	* Creates HTTP Request containing a key value pair as its data. Pointing at 
	* storage service of part 1 
	* @params { JSON OBJECT } kv - A key and a value object.
	* @params { FUNCTION } callback - function that takes status code and output of request.
	*/
	insert: function ( kv, callback ) {

		var options = {
			host: 'localhost',
			port: 3000,
			path: '/part1/',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength( JSON.stringify(kv) )
			}
		}

		// Set up the request
		var post_req = http.request( options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function ( data ) {
				callback( res.statusCode, JSON.parse( data ) )
			});
		});

		// post the data
		post_req.write( JSON.stringify(kv) )
		post_req.end();

	},

	/**
	* Creates HTTP Request containing a key value as its data. Pointing at 
	* storage service of part 1 
	* @pararms { STRING } k - key
	* @params { FUNCTION } callback - function that takes status code and output of request.
	*/
	delete: function ( k, callback ) {

		var payload = { key: k }

		var options = {
			host: 'localhost',
			port: 3000,
			path: '/part1/' + k,
			method: 'DELETE',
			headers:  {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength( JSON.stringify(payload) )
			}
		}
		
		var post_req = http.request( options, function(res) {
			res.setEncoding('utf8');

			// Not expecting return data, boolean to ensure only one callback fires.
			// data would be error info.
			var submitted = false;

			res.on('data', function ( data ) {
				submitted = true
				callback( res.statusCode, data )
			}).on('end', function () {

				if( !submitted ){
					callback( res.statusCode, null )
				}

			})
		})

		post_req.write( JSON.stringify(payload) )
		post_req.end();
	}
}