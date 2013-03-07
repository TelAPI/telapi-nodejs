#! /usr/bin/env node

/**
 * 
 * Retrieve list of the faxes sent with TelAPI
 *
 * --------------------------------------------------------------------------------
 * 
 * @category  TelApi Helper
 * @package   TelApi
 * @author    Nevio Vesic <nevio@telapi.com>
 * @license   http://creativecommons.org/licenses/MIT/ MIT
 * @copyright (2012) TelTech Systems, Inc. <info@telapi.com>
 */

var util       = require("util"); // For logging purposes :)

var Client     = require('telapi').client;

// Load configuration file
var configuration = require('./configuration');

// Setup TelAPI Client
var client = new Client(configuration.account_sid, configuration.auth_token);

// Retrieve latest 20 faxes. 
client.get(
    'faxes', 
    {
    	"PageSize" : 20
    },
    function(response) { // SUCCESS CALLBACK
        for ( var fax in response.faxes ) {
            util.log("Fax JSON is : " + JSON.stringify(response.faxes[fax]) + "\n" );
        }
    },
    function(error) { // ERROR CALLBACK
        util.log("ERROR OCCURED: " + error)
    }
);


