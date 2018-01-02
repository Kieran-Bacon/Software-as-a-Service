module.exports = {

	/**
	* Add time information to console messages for logging.
	* @params { STRING } msg - String message to print.
	*/
	logger: function ( msg ) {
		var time = new Date();
		var timeStamp = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
		console.log( timeStamp + " :: " + msg )
	},

	/**
	* Return an object of HTTP codes for consistent use through project.
	*/

	http_codes: function () {
		var HTTP_STATUS = {
			OK : 200,
			CREATED: 201,
			NO_CONTENT: 204,
			BAD_REQUEST : 400,
			NOT_FOUND: 404,
			ISE: 500, //Internal Server Error
		}

		return HTTP_STATUS
	}
}