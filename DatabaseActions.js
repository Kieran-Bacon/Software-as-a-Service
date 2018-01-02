var mongo = require( "mongodb" )
var mongoClient = mongo.MongoClient
var dbLocation = "mongodb://localhost/egDB"
var dbColl = "egColl"

//Http status codes
var ut = require( './UtilityFunctions.js' )
var HTTP_STATUS = ut.http_codes()

module.exports = {

	/**
	* Overwrites the default database location.
	* @param {STRING} location 
	*/
	SetLocation: function ( location ) {
		dbLocation = location
	},

	/**
	* Overwrites the default collection of the database.
	* @param {STRING} collection 
	*/
	SetCollection: function ( collection ) {
		dbColl = collection
	},

	/**
	* Opens a connection to the database and finds one document with the matching key. 
	* @param { JSON OBJECT } k - contains a key used to identify unqiue rows.
	* @param { FUNCTION } response - takes http code to track success and output (row(s)) from
	* the database.  
	*/
	read: function ( k, response ) {

		mongoClient.connect( dbLocation, function( err, db ) {
			if ( err ) {
				response( HTTP_STATUS.ISE, "ERROR: Database error." )	
			} else {
				var collection = db.collection( dbColl )

				collection.findOne( { key : k }, function( err, res ) {
					if ( err ) {
						response( HTTP_STATUS.ISE, "ERROR: Database error." )
					} else {
						if( res != null ) response( HTTP_STATUS.OK, { key: res.key, value: res.value } )
						else response( HTTP_STATUS.BAD_REQUEST, "ERROR: No entry with that key was found.")
					}
				})
			}

			db.close()
		})
	},


	/**
	* Opens a connection to the database and either creates a new entry or updates an existing entry with
	* new entry information. 
	* @param { JSON OBJECT } kv - contains a key and a value forming a document entry ready for inserting.
	* @param { FUNCTION } response - takes http code to track success and output (row(s)) from
	* the database.  
	*/
	insert: function ( kv, response ) {
		mongoClient.connect( dbLocation, function( err, db ) {
			if ( err ) {
				response( HTTP_STATUS.ISE, "ERROR: Database error." )
			} else {
				var collection = db.collection( dbColl )

				collection.findOne( {key: kv.key, }, function ( err, res ){
					if ( err ) {
						response( HTTP_STATUS.ISE, "ERROR: Database error." )
					} else {

						// Looked to see if Key exists.

						if( res == null ) {
							collection.save( kv, function ( err, res ) {
								if ( err ) {
									response( HTTP_STATUS.ISE , "ERROR: Database error." )
								} else {
									// Key didn't exists therefore we save and return complete.
									response( HTTP_STATUS.CREATED, { key: kv.key, value: kv.value } )
								}
							})
						} else {
							collection.update( { key : kv.key }, kv, function ( err, res ) {
								if ( err ) {
									response( HTTP_STATUS.ISE.status, "ERROR: Database error." )
								} else {
									// Key already exists.
									response( HTTP_STATUS.OK, { key: kv.key, value: kv.value }  )
								}
							})
						}
						db.close()
					}
				})
			}
		})
	},


	/**
	* Opens a connection to the database and deletes the row with the matching key. 
	* @param { JSON OBJECT } k - contains a key used to identify unqiue rows.
	* @param { FUNCTION } response - takes http code to track success and output (row(s)) from
	* the database.  
	*/
	delete: function ( k, response ) {

		mongoClient.connect( dbLocation, function( err, db ) {
			if ( err ) {
				response( HTTP_STATUS.ISE, "ERROR: Database error." )
			} else {
				var collection = db.collection( dbColl )

				collection.remove( { key : k }, function( err, res ) {
					if ( err ) {
						response( HTTP_STATUS.ISE.status, "ERROR: Database error." )
					} else {
						if ( res.result.n != 0 ) response( HTTP_STATUS.NO_CONTENT, null )
						else response( HTTP_STATUS.BAD_REQUEST, "ERROR: No key value pair with that key to delete.")
					}
				})
			}
			db.close()
		})
	},
}