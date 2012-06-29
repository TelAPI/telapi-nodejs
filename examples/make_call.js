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

// A 36 character long Account Sid is always required. It can be described
// as the username for your account
var account_sid = 'ACCOUNT_SID';

// A 34 character long Auth Token is always required. It can be described
// as your account's password
var auth_token  = 'AUTH_TOKEN';


// Setup TelAPI Client
var client = new Client(account_sid, auth_token);

// Create new Call.
// Make sure the From, To and Url parameters are set correctly.
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


