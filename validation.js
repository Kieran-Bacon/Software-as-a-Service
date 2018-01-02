module.exports = {

	/**
	* Checks to see if key is in a valid form. Returns boolean value.
	* @ params { STRING } key - value to validate.
	*/
	Key: function ( key ){

		if( key.match(/^[A-Z][0-9][_]formula/) || key.match(/^[A-Z][0-9][_]value/) ) {
			return true
		} else {
			return false
		}
	},

	Value: function ( value ) {

		return !isNaN( value )

	},

	/**
	* Checks each entry to ensure valid
	* @params { STRING } type - value either formula or value.
	* @params { JSON OBJECT } datapoint - key and value object
	*/
	Datapoint: function ( type, datapoint ){

		if ( type == 'value' ){
			if( module.exports.Key( datapoint.key ) && module.exports.Value( datapoint.value ) ){
				return true
			} else {
				return false
			}
		} else if ( type == 'formula' ){
			if( module.exports.Key( datapoint.key ) && module.exports.Expression( datapoint.value ) ){
				return true
			} else {
				return false
			}
		}

		return false

	},

	/**
	* Validates an expression.
	* @params { STRING } expresion - raw expression string.
	*/
	Expression: function ( expression ) {

		if( expression.substring(0,1) == "="){

			// remove = from the start of expression.

			var escaped = '+' + expression.substring(1).replace( /\s/g, "") + '+'

			// replace keys with 1

            var count = 0
			while( escaped.search( /[-^*()+{}\[\]\/][A-Z]+[0-9]+[-^*()+{}\[\]\/]/ ) != -1 ){
				var bIndex = escaped.search( /[-^*()+{}\[\]\/][A-Z]+[0-9]+[-^*()+{}\[\]\/]/ )+1
				var escapedEnd = escaped.substring( bIndex )
				var eIndex = bIndex + escapedEnd.search( /[-^*()+{}\[\]\/]/ )
				escaped = escaped.substring(0, bIndex) + '1' + escaped.substring(eIndex)
			}

			try{
				eval(escaped.substring( 1, escaped.length -1 ))
				return true
			} catch (e) {
				return false
			}
		} else {
			 return false
		}
	}

}