var express = require( "express" )
var bodyParser = require( "body-parser" )
var app = express()
app.use( bodyParser.json() )

// Including js files.
var db = require( './DatabaseActions.js' )
var ut = require( './UtilityFunctions.js')

/**
* Handles get requests for /part1/*, takes key and attempts to read it from database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.get( "/part1/:key" , function ( reqt, resp ) {
	ut.logger( " Recieved Request: READ - " + reqt.params.key )
	db.read( reqt.params.key, function ( http_status, output) {
		resp.status( http_status )
		resp.json( output )
	})
})

/**
* Handles post requests for /part1/, extracts key and value and attempts to create it in the database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.post( "/part1/", function ( reqt, resp ) {

	ut.logger( " Recieved Request: CREATE - " + reqt.body.key )
	var datapoint = { key: reqt.body.key, value: reqt.body.value }
	
	db.insert( datapoint, function ( http_status, output ){
		resp.status( http_status )
		resp.json( output )
	})

})

/**
* Handles put requests for /part1/*, extracts key and value and attempts to update entry in the database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.put( "/part1/:key", function ( reqt, resp ) {

	ut.logger( " Recieved Request: UPDATE - " + reqt.params.key )

	var datapoint = { key: reqt.params.key, value: reqt.body.value }
	db.insert( datapoint, function ( http_status, output){
		resp.status( http_status )
		resp.json( output )
	})

})

/**
* Handles delete requests for /part1/*, extracts key and attempts to deletes entry in the database.
* @params { STRING } pathname - forms the url address
* @params { FUNCTION } takes incoming request object and returning response object.
*/
app.delete( "/part1/:key", function ( reqt, resp ) {

	ut.logger( " Recieved Request: DELETE - " + reqt.params.key )

	db.delete( reqt.params.key, function ( http_status, output){

		resp.status( http_status )
		resp.json( output )
	})
})

/**
* Starts node server listening on port
* @params { NUMBER } port number
* @params { FUNCTION } defines parts 1 depandancies
*/
app.listen( 3000, function () {
	ut.logger( "Starting..." )
	var loc = "mongodb://localhost/Part1"
	var coll = "kv"
	ut.logger( "Setting local database..."  )
	ut.logger( "Setting Database location as: " + loc  )
	db.SetLocation( loc )
	ut.logger( "Setting collection name as: " + coll  )
	db.SetCollection( coll )
	ut.logger( "Server Started on port 3000." )
	console.log("-------------------------------------------------")
})