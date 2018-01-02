var mongo = require( "mongodb" )
var mongoClient = mongo.MongoClient
var dbLocation = "mongodb://localhost/egDB"
var dbColl = "egColl"

var validate = require( './Validation.js' )
var ut = require( './UtilityFunctions.js')
var HTTP = ut.http_codes()

var db =  require( './DatabaseActions.js' )

module.exports = {


	/**
	* Change the default Database Functions to another file implementing the same functions. 
	* @param { STRING } db_connetion - Functions file address.  
	*/
	toggleDBActions: function ( db_connetion ) {
		db = require( db_connetion )
	},

	/**
	* Stepping stone function designed to make use of these functions easier to understand. 
	* @param { STRING } key - The Key value of an existing formula entry.
	* @param { FUNCTION ( http_code, output ) } callback - A call back function to be executed when
	* computation finishes, takes a status code and the evaluated value as its arguments.  
	*/
	evaluateExpression: function ( key, callback ){
		module.exports.resolveExpression( '', key, [], [], callback )
	},


	/**
	* Recursive resolve function that builds a final expression as it progresses through the initial expression replacing
	* keys with their expressions or values. Computation stops when there are no more keys to be replaces and the expressions
	* is mathematically correct. 
	* @param { STRING } completed - Parts of the expression that contain no keys, left hand side of any key values or 
	* unproccessed sections.
	* @param { STRING } expressionKey - The Key value of an existing formula entry.
	* @param { STRING ARRAY } unproccessed -  Array of unprocessed snippets of the expression, acting like a stack.
	* @param { STRING ARRAY } callstack - Array of expression keys keeping track of previously visited keys that have yet to 
	* have a set value. Used to detect circular difinitions.
	* @param { FUNCTION ( http_code, output ) } callback - A call back function to be executed when
	* computation finishes, takes a status code and the evaluated value as its arguments. 
	*/
	resolveExpression: function ( completed , expressionKey, unprocessed, callstack, callback ){

		// Check to see if expression key is valid
		if( expressionKey != null ){
			// Check to see that there isn't a circular expression by checking callstack/
			if ( callstack.indexOf( expressionKey ) != -1 ){
				callback( HTTP.BAD_REQUEST, "ERROR: Circular definition found, unable to evaluate.")
			} else {
				// Record key in call stack and then read in value from database.
				callstack.push( expressionKey )
				db.read( expressionKey, function ( expStatus, row ){

					if( expStatus == HTTP.OK) {
						// Expression was found, continue to refactor taking all info along.
						module.exports.refactor( completed, row.value.substring(1), unprocessed, callstack, callback)
					} else {

						// Expressions not found therefore no circular reasoning for this key, remove it from callstack
						callstack.pop()

						// Create alternate key to look for value entry
						alternateKey = expressionKey.substring( 0, expressionKey.length - 8 ) + '_value'

						db.read( alternateKey, function ( valStatus, row ) {
							if( valStatus == HTTP.OK ){

								// raw value can be appended to completed
								var lhs = completed + row.value

								if( unprocessed.length != 0 ){
									// Things still left to check, extract from unprcessed and continue to refactor.
									var current = unprocessed.pop()
									module.exports.refactor( lhs, current , unprocessed, callstack, callback )
								} else {
									// Nothing left to process, evaluate the completed string and return its value.
									try{
										callback( HTTP.OK, eval( lhs ))
									} catch (e) {

										// Condition should never be meet, fires when completed string is malformed.
										// All expressions are validated when created or updated.

										callback( HTTP.BAD_REQUEST, 'ERROR: Expression is invalid.')
									}
								}
							} else {

								// No value found, therefore expressions points to cells that do not exist
								// Return undefined and stop computation.

								callback( HTTP.BAD_REQUEST, 'ERROR: Cell has undefined properties.')
							}
						})
					}
				})
			}
		} else {
			// No key given

			if( unprocessed.length != 0) {
				// Still things to evaluate, pop and continue to refactor
				var current = unprocessed.pop()
				module.exports.refactor( completed, current, unprocessed, callstack, callback )
			} else {
				// Everything has been processed.
				try{
					callback( HTTP.OK, eval( completed ))
				} catch (e) {

					// Condition should never be meet, fires when completed string is malformed.
					// All expressions are validated when created or updated.

					callback( HTTP.BAD_REQUEST, 'ERROR: Expression is invalid.')
				}
			}
		}
	},


	/**
	* Examines a raw expression and seperates it into three parts: Left hand side of the first key found that does not need to
	* be evaluated, Key reference that needs to be evaluated, and the unprocessed right hand side of the expression key. 
	* @param { STRING } lhs - Parts of the expression that contain no keys, left hand side of any key values or 
	* unproccessed sections.
	* @param { STRING } raw_expression - Mathematical statement potentially containing expression keys.
	* @param { STRING ARRAY } unproccessed -  Array of unprocessed snippets of the expression/previous expressions, acting like a stack.
	* @param { STRING ARRAY } callstack - Array of expression keys keeping track of previously visited keys that have yet to 
	* have a set value. Used to detect circular difinitions.
	* @param { FUNCTION ( http_code, output ) } callback - A call back function to be executed when
	* computation finishes, takes a status code and the evaluated value as its arguments. 
	*/
	refactor: function ( lhs, raw_expression, unprocessed, callstack, callback ) {

		// Remove any redundant blank space from the expression
		var expression = raw_expression.replace( " ", "")

		if ( expression.search( /[A-Z]/ ) != -1 ){
			// A key value exists within the expression, find index of first and last character of key.
			var bIndex = expression.search( /[A-Z]/ )
			var escapedEnd = expression.substring( bIndex ) + '+'
			var eIndex = bIndex + escapedEnd.search( /[-^*()+{}\[\]\/]/ )
			// Concatinate everything left of key into the lhs, extract expression key, push into unprocessed right hand side.
			lhs = lhs + expression.substring(0, bIndex) + '('
			var subExpressionKey = expression.substring( bIndex, eIndex ) + '_formula'
			unprocessed.push( ')'+expression.substring(eIndex) )
			// return to resolveExpression to replace key with expression or value.
			module.exports.resolveExpression( lhs, subExpressionKey, unprocessed, callstack, callback) 
		} else {

			// No key found therefore pop from callstack as previous key evaluates to value.
			callstack.pop()
			lhs = lhs + expression 
			// return to resolve expressions to work on unprocessed or to evaluate and return to user.
			module.exports.resolveExpression( lhs, null, unprocessed, callstack, callback )
		}
	}
}