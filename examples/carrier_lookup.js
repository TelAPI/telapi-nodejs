#! /usr/bin/env node

/**
 * 
 * Find out carrier details about particular number
 * The carrier lookup method supports international lookups!
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
    'carrier',
    { 'PhoneNumber' : '{PhoneNumber_E.164}' },
    function(response) { // SUCCESS CALLBACK
        for(var carrier in response.carrier_lookups) {
            util.log(
                "Carrier lookup cost " + 
                response.carrier_lookups[carrier].price + 
                ". Phone Number carrier is: " + 
                response.carrier_lookups[carrier].carrier + "."
            );
        }
    },
    function(error) { // ERROR CALLBACK
        util.log("Usage Error: " + error)
    }
);


