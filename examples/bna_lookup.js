#! /usr/bin/env node

/**
 * 
 * Retrieve First and Last name + Address of the phone number holder. 
 * Only US phone numbers can have BNA lookups performed on them.
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
 
client.create(
    'bna_lookup',
    { 'PhoneNumber' : '{PhoneNumber_E.164}' },
    function(response) { // SUCCESS CALLBACK
        for(var bna in response.bna_lookups) {
            util.log(
                "Bna lookup cost " + 
                response.bna_lookups[bna].price + 
                ". Address is: " + 
                response.bna_lookups[bna].address + 
                "."
            );
        }
    },
    function(error) { // ERROR CALLBACK
        util.log("Usage Error: " + error)
    }
);


