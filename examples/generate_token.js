#! /usr/bin/env node

/**
 * 
 * Generate client token against Application with TelAPI
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

// Generate client token against Application with TelAPI 
client.create(
    [ 'applications', '{application_sid}', 'GenerateToken', 
    {},
    function(response) { // SUCCESS CALLBACK
        util.log("Token successfully generated with data: " + JSON.stringify(response) );
    },
    function(error) { // ERROR CALLBACK
        util.log("ERROR OCCURED: " + error)
    }
);


