var util  = 
	require('util'), 
	telapi_schema = require("./schemas/telapi.json"), 
	S = require('string'),
	querystring = require('querystring'),
	https = require('https');


var TelAPI = module.exports.TelAPI = function(account_sid, auth_token) {

	/** TelAPI AccountSid **/
	this.account_sid = account_sid;

	/** TelAPI AuthToken **/
	this.auth_token  = auth_token;

	this.host        = 'api.telapi.com';

	this.port        = 443;

	/** Base and required helper URI from which all URIs are built **/
	this.base_uri    = '/%s/Accounts/%s';

	/** TelAPI version **/
	this.api_version = '2011-07-01';

	/** TelAPI content type **/
	this.content_type = 'json';

	/** Current request url. THIS WILL BE REWRITTEN BY CLASS ITSELF! **/
	this.request_url  = '';

	/** ... **/
	this.request_method 	  = 'GET';

	this.request_querystring  = {};

	this.raw_response         = null;

	this.response_headers     = {}; 

	/** Status code returned with response. 500 is default **/
	this.response_status_code = 500;

	this.response_error_message  = null;

	/** MASTER CRUD API METHODS. EVERTHING YOU NEED TO HAVE **/

	this.get         = function(resource, parameters) {
		
		var self = new TelAPI(this.account_sid, this.auth_token);
		util.log("[INFO] BUILT URL IS: " + self._buildUrl(resource, parameters))
		self.request_method = 'GET';
		self._run();

		return self;
	};

	this.create      = function(resource, post_data) {

	};

	this.update      = function(resource, post_data) {

	};

	this.delete      = function(resource) {

	};

	/** "PRIVATE" MEMBERS USED FOR INTERNAL PURPOSES ONLY **/

	/**
	 *
	 */
	this._buildUrl   = function(uri_parts, parameters) {
		
		// Restart request url to zero
		this.request_url = '';

		// Now let's build base url which will include account
		this.request_url = util.format(this.base_uri, this.api_version, this.account_sid);

		// In case that user wants to fetch account or accounts resorce we are breaking url built
		// because we already have it built
		if( typeof uri_parts == 'string' ) {
			if (uri_parts == 'account' || uri_parts == 'accounts') {
				this.request_url += '.' + this.content_type;
				return this.request_url;
			}
		}

		this.request_url += '.' + this.content_type;

		return this.request_url;
	}

	this._processResponse = function() {
		util.log("[INFO] RESPONSE: " + response );
	};

	/**
	 *
	 */
	this._run        = function() {
		
		var request_options = {
			host   : this.host,
			port   : this.port,
			path   : this.request_url,
			method : this.request_method,
			auth   : this.account_sid + ":" + this.auth_token,
		};

		if(this.request_method == 'POST') {
			
			var post_data = querystring.stringify(this.request_querystring);

			request_options.method = 'POST';
			request_options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
          		'Content-Length': post_data.length
			}

		} else {
			https.get(request_options, function(resp) {

				resp.setEncoding('utf8');

				this.response_headers = resp.headers;
				this.response_status_code = resp.statusCode;
				
				response_data = '';

				resp.on('data', function(data) { response_data = data; });

				util.log(resp.data);

				resp.end();
				
			}).on('error', function(err){ 
				this.response_status_code   = 500;
				this.response_error_message = err;
				this.this._processResponse();
			});
		}



	}

	// Let's make sure that credentials are set...
	if(this.account_sid.length != 34 || !S(this.account_sid).startsWith('AC')) throw new Error("AccountSid is not valid!");
	if(this.auth_token.length != 32) throw new Error("AuthToken is not valid!");

};