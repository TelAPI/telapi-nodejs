#! /usr/bin/env node

/**
 * 
 * Retrieve TelAPI account usage
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
    [ 'usages' ],
    null,
    function(response) { // SUCCESS CALLBACK
        for(var usage in response.usages) {
            util.log(
                "Usage average cost for " + 
                response.usages[usage].month + 
                " month is " + 
                response.usages[usage].average_cost + 
                " USD."
            );
        }
    },
    function(error) { // ERROR CALLBACK
        util.log("Usage Error: " + error)
    }
);


