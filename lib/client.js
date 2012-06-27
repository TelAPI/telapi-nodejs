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
    this.request_method       = 'GET';

    this.request_querystring  = {};

    this.request_postdata     = {};


    /** MASTER CRUD API METHODS. EVERTHING YOU NEED TO HAVE **/

    this.get         = function(resource, parameters, success, error) {
        util.log("[INFO] RESOURCE DETAILS: " + resource);
        util.log("[INFO] BUILT URL IS: " + this._buildUrl(resource, parameters));
        this._run(success, error);
    };

    this.create      = function(resource, post_data) {

    };

    this.update      = function(resource, post_data) {

    };

    this.delete      = function(resource) {

    };

    this.getResource = function(resource) {
        for(var component in telapi_schema.rest_api.components) {
            if(component == resource.toLowerCase()) {
                return telapi_schema.rest_api.components[component];
            }
        }
        return null;
    };

    this.resourceExists = function(resource) {
        for(var component in telapi_schema.rest_api.components) {
            if(component == resource.toLowerCase()) return true;
        }
        return false;
    };

    this.getAvailableResources = function() {
        var available_resources = [];
        for(var component in telapi_schema.rest_api.components) {
            available_resources.push(component);
        }
        return available_resources;
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

        var resource_details = {};

        // In case that user wants to fetch account or accounts resorce we are breaking url built
        // because we already have it built
        if( typeof uri_parts == 'string' ) {
            
            if (uri_parts == 'account' || uri_parts == 'accounts') {
                this.request_url += '.' + this.content_type;
                return this.request_url;
            } else {

                if(!this.resourceExists(uri_parts)) {
                    throw new Error(
                        "Resource [" + uri_parts + "] do not exist and therefore is not valid "+ 
                        "resource. Available resources are: [" + this.getAvailableResources() + "]"
                    );
                }

                resource_details = this.getResource(uri_parts);
                this.request_url += "/" + resource_details.url;

            }

        }

        this.request_url += '.' + this.content_type;

        return this.request_url;
    }

    /**
     *
     */
    this._run        = function(succ, err) {
        
        var request_options = {
            host   : this.host,
            port   : this.port,
            path   : this.request_url,
            method : this.request_method,
        };

        request_options.headers = {}
        request_options.headers.Host = this.host;
        request_options.headers.Authorization = "Basic " + (new Buffer(this.account_sid + ':' + this.auth_token)).toString('base64');

        var request = https.get(request_options, function(response) {
            var responseChunks = [];
            response.setEncoding('utf8');

            response.on('data', function(chunk) { responseChunks.push(chunk); });

            response.on('end', function() {
                try { body = JSON.parse(responseChunks.join('')); } 
                catch(err) { }
                if(typeof succ == 'function') succ(body);
            });

            if(typeof err == 'function') response.on('error', err);
            
        });

    }

    // Let's make sure that credentials are all set...
    if(this.account_sid.length != 34 || !S(this.account_sid).startsWith('AC')) throw new Error("AccountSid is not valid!");
    if(this.auth_token.length != 32) throw new Error("AuthToken is not valid!");

};