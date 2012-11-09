#! /usr/bin/env node

/**
 * 
 * Retrieve TelAPI account usage by sid
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

// Retrieve specific account details. 
client.get(
    [ 'usages', '{AccountUsageSid}' ],
    null,
    function(response) { // SUCCESS CALLBACK
        util.log(
            "Usage average cost for " + 
            response.month + 
            " month is " + 
            response.average_cost + 
            " USD."
        );
    },
    function(error) { // ERROR CALLBACK
        util.log("Usage Error: " + error)
    }
);


