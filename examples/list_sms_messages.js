#! /usr/bin/env node

/**
 * 
 * Retrieve the 10 newest account sms messages with TelAPI
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

client.get(
    'sms_messages', 
    { 'PageSize' : 10 }, // Limit to 10 sms messages per page
    function(response) { // SUCCESS CALLBACK

        // Iterate through response sms messages and display their respective SIDs
        for ( var sms in response.sms_messages ) {
            util.log("SmsMessage SID: " + response.sms_messages[sms].sid);
        }

    },
    function(error) { // ERROR CALLBACK
        util.log("ERROR OCCURED: " + error)
    }
);