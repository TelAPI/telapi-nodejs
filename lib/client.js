var util 		 = require('util'), TelapiSchema = require("./schemas/telapi.json"), S = require('string');

var TelAPI = module.exports.TelAPI = function(account_sid, auth_token) {

	/** TelAPI AccountSid **/
	this.account_sid = account_sid;

	/** TelAPI AuthToken **/
	this.auth_token  = auth_token;

	/** Base and required helper URI from which all URIs are built **/
	this.base_url    = 'https://api.telapi.com/%s/Accounts/%s';

	/** TelAPI version **/
	this.api_version = '2011-07-01';

	/** TelAPI content type **/
	this.content_type = 'json';

	/** Current request url. THIS WILL BE REWRITTEN BY CLASS ITSELF! **/
	this.current_url  = '';

	this.raw_response = null;

	/** MASTER CRUD API METHODS. EVERTHING YOU NEED TO HAVE **/

	this.get         = function(resource, parameters) {
		util.log("[INFO] BUILT URL IS: " + this._buildUrl(resource, parameters))

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
		
		// Restart current url to zero
		this.current_url = '';

		// Now let's build base url which will include account
		this.current_url = util.format(this.base_url, this.api_version, this.account_sid);

		// In case that user wants to fetch account or accounts resorce we are breaking url built
		// because we already have it built
		if( typeof uri_parts == 'string' ) {
			if (uri_parts == 'account' || uri_parts == 'accounts') {
				return this.current_url;
			}
		}

		return this.current_url;
	}

	/**
	 *
	 */
	this._run        = function() {

	}

	// Let's make sure that credentials are set...
	if(this.account_sid.length != 34 || !S(this.account_sid).startsWith('AC')) throw new Error("AccountSid is not valid!");
	if(this.auth_token.length != 32) throw new Error("AuthToken is not valid!");

};