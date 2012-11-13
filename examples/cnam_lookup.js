#! /usr/bin/env node

/**
 * 
 * 
 * Only US phone numbers can have CNAM lookups performed on them.
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
    'cnam',
    { 'PhoneNumber' : '{PhoneNumber_E.164}' },
    function(response) { // SUCCESS CALLBACK
        for(var cnam in response.cnam_dips) {
            util.log(
                "CNAM lookup cost " + 
                response.cnam_dips[cnam].price + 
                ". Cnam body is: " + 
                response.cnam_dips[cnam].body + "."
            );
        }
    },
    function(error) { // ERROR CALLBACK
        util.log("Usage Error: " + error)
    }
);


