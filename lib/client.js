/**
 * telapi
 * Copyright (c) 2012 TelTech Systems Inc. <info@telapi.com>
 * MIT Licensed
 */

var util  = 
    require('util'), 
    telapi_schema = require("./schemas/telapi.json"), 
    S = require('string'),
    querystring = require('querystring'),
    https = require('https');


module.exports = function(account_sid, auth_token) {

    /**
     * TelAPI Account Sid is unique to the account. AccountSid can be
     * found at: http://www.telapi.com/dashboard
     *
     * @param {String} account_sid: (Required)
     */
    this.account_sid = account_sid;

    /**
     * TelAPI Auth Token is unique to the account. AuthToken can be
     * found at: http://www.telapi.com/dashboard
     *
     * @param {String} auth_token: (Required)
     */
    this.auth_token  = auth_token;

    /**
     * TelAPI API host
     *
     * @param {String} host: (Required)
     */
    this.host        = 'api.telapi.com';

    /**
     * TelAPI API port (SSL)
     *
     * @param {Int} port: (Required)
     */
    this.port        = 443;

    /**
     * TelAPI base URI. This is used for internal purposes of building the URL
     *
     * @param {String} base_uri: (Required)
     */
    this.base_uri    = '/%s/Accounts/%s';

    /**
     * TelAPI API active version.
     *
     * @param {String} api_version: (Required)
     */
    this.api_version = 'v1';

    /**
     * TelAPI contant type. Currently the Node.JS helper supports only JSON, so please do not
     * change the variable to anything else.
     *
     * @param {String} content_type: (Required)
     */
    this.content_type = 'json';

    /**
     * TelAPI INTERNAL: Built Request URL will be stored and used from here
     *
     * @param {String} request_url: (Required)
     */
    this.request_url  = '';

    /**
     * TelAPI INTERNAL: Request method. Can be GET, POST, DELETE
     *
     * @param {String} request_method: (Required)
     */
    this.request_method       = 'GET';

    /**
     * TelAPI INTERNAL: Prepared query string (GET)
     *
     * @param {String} request_querystring: (Required)
     */
    this.request_querystring  = {};

    /**
     * TelAPI INTERNAL: Prepared post data that will be sent with POST
     *
     * @param {String} request_postdata: (Required)
     */
    this.request_postdata     = {};

     /**
     * TelAPI INTERNAL: Used as a schema validation helper
     *
     * @param {Object} resource_details: (Required)
     */   
    this.resource_details     = {};

    /** --------------------------------------------------------------------------- **/
    /** MASTER CRUD API METHODS. EVERTHING YOU NEED TO INTERACT WITH THE REST API   **/
    /** --------------------------------------------------------------------------- **/

    /**
     * Method used to fetch details about some particular resource instance or to list
     * resource items based on pagination rules
     *
     * @param {String}   resource:   (Required) Valid resources: see this.getAvailableResources()
     * @param {Object}   parameters: (Optional) Parameters {} used for pagination/filter purposes
     * @param {Function} success:    (Optional) Success callback
     * @param {Function} error:      (Optional) Error callback
     */
    this.get         = function(resource, parameters, success, error) {
        this._buildUrl(resource, parameters)
        this._run(success, error);
    };

    /**
     * Method used to create new instance of some resource
     *
     * @param {String}   resource:   (Required) Valid resources: see this.getAvailableResources()
     * @param {Object}   post_data:  (Required) Post data {} that you want to send with instance creation
     * @param {Function} success:    (Optional) Success callback
     * @param {Function} error:      (Optional) Error callback
     */
    this.create      = function(resource, post_data, success, error) {
        this.request_method = 'POST';
        this._buildUrl(resource, {});
        this._assertPostData(post_data);
        this._run(success, error);
    };

    /**
     * Method used to update existing instance of some resource
     *
     * @param {String}   resource:   (Required) Valid resources: see this.getAvailableResources()
     * @param {Object}   post_data:  (Required) Post data {} that you want to send with instance update
     * @param {Function} success:    (Optional) Success callback
     * @param {Function} error:      (Optional) Error callback
     */
    this.update      = function(resource, post_data, success, error) {
        this.request_method = 'POST';
        this._buildUrl(resource, {});
        this._assertPostData(post_data);
        this._run(success, error);
    };

    /**
     * Method used to delete existing instance of some resource
     *
     * @param {String}   resource:   (Required) Valid resource and sid: see this.getAvailableResources()
     * @param {Function} success:    (Optional) Success callback
     * @param {Function} error:      (Optional) Error callback
     */
    this.delete      = function(resource, success, error) {
        this._buildUrl(resource, {});
        this.request_method = 'DELETE';
        this._run(success, error);
    };

    /**
     * Method used to get details about resource
     *
     * @param {String}   resource:   (Required) Valid resources: see this.getAvailableResources()
     *
     * @returns {Object} or {null}
     */
    this.getResource = function(resource) {
        for(var component in telapi_schema.rest_api.components) {
            if(component == resource.toLowerCase()) {
                return telapi_schema.rest_api.components[component];
            }
        }
        return null;
    };

    /**
     * Method used to check whether resource exists or not
     *
     * @param {String}   resource:   (Required) Valid resource name
     *
     * @returns {Boolean}
     */
    this.resourceExists = function(resource) {
        for(var component in telapi_schema.rest_api.components) {
            if(component == resource.toLowerCase()) return true;
        }
        return false;
    };

    /**
     * Method used to retreive all available REST resources
     *
     * @returns {Object}
     */
    this.getAvailableResources = function() {
        var available_resources = [];
        for(var component in telapi_schema.rest_api.components) {
            available_resources.push(component);
        }
        return available_resources;
    };

    /** --------------------------------------------------------------------------- **/
    /** "PRIVATE" MEMBERS USED FOR INTERNAL PURPOSES ONLY **/
    /** --------------------------------------------------------------------------- **/

    /**
     * Method used to build TelAPI request URL
     *
     * @param {Mixed}    uri_parts:   (Required) Valid resource and (if) instance: see this.getAvailableResources()
     * @param {Object}   parameters:  (Optional) Parameters {} used for pagination/filter purposes
     */
    this._buildUrl   = function(uri_parts, parameters) {
        
        // Restart request url to nothing
        this.request_url = '';

        // Now let's build the base url which includes the account
        this.request_url = util.format(this.base_uri, this.api_version, this.account_sid);

        var resource_details = {};
        var resource         = '';
        var resource_extras  = '';

        // In case that user wants to fetch account or accounts resource we are breaking url built
        // because we already have it built
        if( typeof uri_parts == 'string' ) {
            resource = uri_parts;
        }
        else if (typeof uri_parts == 'object') {
            resource = uri_parts[0];
            delete uri_parts[0];
            for(var index in uri_parts) resource_extras += "/" + uri_parts[index];
        }

        if (resource != 'account' && resource != 'accounts') {

            if(!this.resourceExists(resource)) {
                throw new Error(
                    "Resource [" + resource + "] does not exist and therefore is not a valid "+ 
                    "resource. Available resources are: [" + this.getAvailableResources() + "]"
                );
            }

            resource_details = this.getResource(resource);
            this.request_url += "/" + resource_details.url + resource_extras;
        }

        this.resource_details = resource_details;

        this.request_url += '.' + this.content_type;
        this._assertGetParams(parameters);

        return this.request_url;

    }

    /**
     * Internal method used to assert Request URI GET parameters
     *
     * @param {Object}   parameters: (Optional) Parameters {} used for pagination/filter purposes
     */
    this._assertGetParams = function(parameters) {
        this.request_querystring = querystring.stringify(parameters);
        if( this.request_querystring.length > 1) this.request_url += "?" + this.request_querystring;
    };

    /**
     * Internal method used to assert request POST data 
     *
     * @param {Object}   post_data: (Required) Data that will be sent with request
     */
    this._assertPostData = function(post_data) {
        this._validatePostData(post_data);
        this.request_postdata = querystring.stringify(post_data);
    };

    /**
     * Internal method used to validate given POST data for specific resource. If
     * one of the required resource parameters are missing, error will be thrown
     *
     * @param {Object}   post_data: (Required) Data that will be sent with request
     */
    this._validatePostData = function(post_data) {
        for(var param in this.resource_details.create_params) {
            if(!(this.resource_details.create_params[param] in post_data)) {
                throw new Error(
                    "Invalid POST data. Missing required attribute '" + 
                    this.resource_details.create_params[param] + 
                    "'. "
                );
            }
        }
    };

    /**
     * Internal method used to send requests to TelAPI
     *
     * @param {Function} success:    (Optional) Success callback
     * @param {Function} error:      (Optional) Error callback
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

        if(this.request_method == 'POST') {
            request_options.headers['Content-Length'] = this.request_postdata.length;
            request_options.headers['Content-Type']   = 'application/x-www-form-urlencoded';
        }
        
        if ( this.request_method == 'DELETE' ) request_options.headers['Content-Length'] = 0;

        var request = https.request(request_options, function(response) {
            var responseChunks = [];
            response.setEncoding('utf8');

            response.on('data', function(chunk) { responseChunks.push(chunk); });

            response.on('end', function() {
                try { 
                    body = JSON.parse(responseChunks.join('')); 
                } 
                catch(err) { 
                    throw new Error(
                        "Error occured: 'Cannot parse JSON'. TelAPI returned: " + responseChunks.join('')
                    ); 
                }
                
                if ( response.statusCode != 200 ) {
                    if(body.status != 200) {
                        if(typeof err == 'function') return err(body);
                        else throw new Error("TelAPI Error: '" + body.message + "'. More info URL: '" + body.more_info + "'");
                    }
                }
                
                if(typeof succ == 'function') succ(body);

            });

            if(typeof err == 'function') response.on('error', err);
            
        });

        if(this.request_method == 'POST') request.write(this.request_postdata);
        request.end();

    }


    /** --------------------------------------------------------------------------- **/
    /** CHECK SOME INTERNAL STUFF ONCE CLASS IS BEING INITIALIZED **/
    /** --------------------------------------------------------------------------- **/

    if(this.account_sid.length != 34 || !S(this.account_sid).startsWith('AC')) throw new Error("AccountSid is not valid!");
    if(this.auth_token.length != 32) throw new Error("AuthToken is not valid!");

};
