var express = require( "express" )
var bodyParser = require( "body-parser" )
var app = express()
app.use( bodyParser.json() )

// Including js files.
var ut = require( './UtilityFunctions.js')
var db = require( './ExternalDB.js' )
var ev = require( './Evaluations.js' )
var validate = require( './Validation.js' )
var HTTP = ut.http_codes()

/**
* Handles get requests, takes key and attempts to read it from database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.get( "/websheet/:key/:type", function (reqt, resp) {

	// Construct a valid key with key and type.
	var keyValue = reqt.params.key + "_" + reqt.params.type

	if ( validate.Key( keyValue ) ) {
		if( reqt.params.type == 'value' ){

			ut.logger( "Recieved Request: READ VALUE OF - " + reqt.params.key )
			alternativeKey = reqt.params.key + "_formula"

			db.read( alternativeKey, function ( read_code, read_response ) {

				if ( read_code == HTTP.OK ){
					// Formula exists therefore evaluate and return

					ev.evaluateExpression( alternativeKey, function ( resolve_Code, resolve_value ) {

						resp.status( resolve_Code )
						resp.json( { key: reqt.params.key, value: resolve_value } )

						// After update we will ensure value is correct by storing the evaluated code.
						// if the resolve Expression returned successfully.

						if( resolve_Code == HTTP.OK ){
							// We don't want to do anything with response, and failure to insert wouldn't be an issue.
							db.insert( {key: keyValue, value: resolve_value }, function ( c, o) {})
						}
					})

				} else {

					// Error on read or there is no value for Formula, either way we want to be helpful
					// and return something of use

					db.read( keyValue, function ( value_code, value_output ) {
						resp.status( value_code )
						if ( value_code == HTTP.OK ){
							// eval response to ensure floating point number.
							value_output = { key: reqt.params.key, value: eval(value_output.value) }
						}
						resp.json( value_output )
					})
				}
			})

		} else if ( reqt.params.type == 'formula' ) {


			ut.logger( "Recieved Request: READ FORMULA OF - " + reqt.params.key )
			db.read( keyValue, function ( http_status, output) {
				resp.status( http_status )
				if( http_status == HTTP.OK ){
					resp.json( { key: reqt.params.key, value: output.value } )
				} else {
					resp.json( output )
				}
			})
		} else {

			// Address incorrect 

			resp.status( HTTP.NOT_FOUND )
			resp.json( "ERROR: Not serving at the address." )
		}
	} else {

		// Key is invalid

		resp.status( HTTP.BAD_REQUEST )
		resp.json( "ERROR: Malformed Request." )
	}
})

/**
* Handles post requests, extracts key and value and attempts to create it in the database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.post( "/websheet/:type/", function (reqt, resp) {

	if( reqt.params.type == 'formula' || reqt.params.type == 'value' ){

		ut.logger( "Recieved Request: CREATE " + reqt.params.type.toUpperCase() + " FOR - " + reqt.body.key )

		//Extract data
		var keyValue = reqt.body.key + "_" + reqt.params.type
		var datapoint = { key: keyValue, value: reqt.body.value }

		if ( validate.Datapoint( reqt.params.type, datapoint ) ){

			//For value ensure number.

			if ( reqt.params.type == 'value' ) datapoint.value = eval( reqt.body.value )

			db.insert( datapoint, function ( http_status, output ) {
				resp.status( http_status )
				resp.json( {key: reqt.body.key, value: output.value} )
			})

		} else {
			resp.status( HTTP.BAD_REQUEST )
			resp.json( "ERROR: Malformed Request data.")
		}
	} else {
		resp.status( HTTP.NOT_FOUND )
		resp.json( "ERROR: Not serving at the address.")
	}
})

/**
* Handles put requests, extracts key and value and attempts to update entry in the database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.put( "/websheet/:key/:type", function ( reqt, resp ){


	if( reqt.params.type == 'formula' || reqt.params.type == 'value' ){

		ut.logger( "Recieved Request: UPDATE - " + reqt.params.type.toUpperCase() + " FOR - " + reqt.params.key )

		//Extract data
		var keyValue = reqt.params.key + "_" + reqt.params.type
		var datapoint = { key: keyValue, value: reqt.body.value }

		if ( validate.Datapoint( reqt.params.type, datapoint ) ){

			//For value ensure number.

			if ( reqt.params.type == 'value' ) datapoint.value = eval( reqt.body.value )

			db.insert( datapoint, function ( http_status, output ) {
				resp.status( http_status )
				resp.json( {key: reqt.body.key, value: output.value} )
			})

		} else {
			resp.status( HTTP.BAD_REQUEST )
			resp.json( "ERROR: Malformed Request data.")
		}
	} else {
		resp.status( HTTP.NOT_FOUND )
		resp.json( "ERROR: Not serving at the address.")
	}
})

/**
* Handles delete requests, extracts key and attempts to deletes entry in the database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.delete( "/websheet/:key/:type", function ( reqt, resp ) {

	ut.logger( "Recieved Request: DELETE " + reqt.params.type.toUpperCase() + " FOR - " + reqt.params.key )

	if( reqt.params.type == 'formula' || reqt.params.type == 'value' ){

		var keyValue = reqt.params.key + "_" + reqt.params.type
		if ( validate.Key( keyValue ) ){

			db.delete( keyValue, function ( http_status, output){
				resp.status( http_status )
				resp.json( output )
			})
		} else {
			resp.status( HTTP.BAD_REQUEST )
			resp.json( "ERROR: Malformed Request data.")
		}
	} else {
		resp.status( HTTP.NOT_FOUND )
		resp.json( "ERROR: Not serving at the address.")
	}
})

/**
* Starts node server listening on port
* @params { NUMBER } port number
* @params { FUNCTION } defines parts 1 depandancies
*/
app.listen( 3001, function () {
	ut.logger( "Starting..." )
	var dbSelect = "./ExternalDB.js"
	ut.logger( "Setting Database as service: localhost:3000/part1/"  )
	ev.toggleDBActions( dbSelect )
	ut.logger( "Server Started on port 3001." )
	console.log("-------------------------------------------------")
})