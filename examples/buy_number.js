#! /usr/bin/env node

/**
 * 
 * Buy a new phone number with TelAPI
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

// Retrieve an available phone number, and if successful, attempt to purchase the number.
client.get(
    ['available_phone_numbers', 'US', 'Local'], 
    { 
        'PageSize' : 1  // Limit to 1 available number per page
    },
    function(response) { // SUCCESS CALLBACK

        // Iterate through available_phone_numbers 
        for ( var available_number in response.available_phone_numbers ) {

            phone_number = response.available_phone_numbers[available_number].phone_number;

            util.log("Available Phone Number: " + phone_number);

            //Now what we need to is add the available number to our account using /IncomingPhoneNumbers
            //Remember that the price depends on the phone number type & location.
            client.create(
                'incoming_phone_numbers',
                { 'PhoneNumber' : phone_number },
                function (response) { // SUCCESS CALLBACK
                    util.log("Phone number purchase SID: " + response.sid);
                },
                function(error) { // ERROR CALLBACK
                    util.log("Error at IncomingPhoneNumber purchase: " + error)
                }
            );


        }

    },
    function(error) { // ERROR CALLBACK
        util.log("Error at AvailablePhoneNumbers: " + error)
    }
);