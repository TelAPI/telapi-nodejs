#! /usr/bin/env node

/**
 * 
 * How to make a new call with TelAPI
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

// Create new Call.
// Make sure the From, To, and Url parameters are set correctly.
client.create(
    'calls', 
    { 
        "From" : "(XXX) XXX-XXXX", 
        "To"   : "(XXX) XXX-XXXX", 
        "Url" : "http://dl.dropbox.com/u/5862192/telapi_xml.xml"
    },
    function(response) { // SUCCESS CALLBACK
        util.log("Call successfully queued. Call SID: " + response.sid);
    },
    function(error) { // ERROR CALLBACK
        util.log("Error occured: " + error)
    }
);


