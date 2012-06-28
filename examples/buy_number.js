#! /usr/bin/env node

/**
 * 
 * Buy new phone number with TelAPI
 *
 * --------------------------------------------------------------------------------
 * 
 * @category  TelApi Helper
 * @package   TelApi
 * @author    Nevio Vesic <nevio@telapi.com>
 * @license   http://creativecommons.org/licenses/MIT/ MIT
 * @copyright (2012) TelTech Systems, Inc. <info@telapi.com>
 */

var util       = require("util"); // For loging purposes :)

var Client     = require('telapi').client;

// A 36 character long AccountSid is always required. It can be described
// as the username for your account
var account_sid = 'ACCOUNT_SID';

// A 34 character long AuthToken is always required. It can be described
// as your account's password
var auth_token  = 'AUTH_TOKEN';


// Setup TelAPI Client
var client = new Client(account_sid, auth_token);

// Retrieve 1 available phone number and if successful attempt to purchase number.
client.get(
    'available_phone_numbers', 
    { 
        'PageSize' : 1  // Limit to 1 available number per page
    },
    function(response) { // SUCCESS CALLBACK
        
        // Iterate through available_phone_numbers 
        for ( var available_number in response.available_phone_numbers ) {

            phone_number = response.available_phone_numbers[available_number].phone_number;

            util.log("Available Phone Number: " + phone_number);

            // Now what we need to do is to insert new phone number to account incoming phone numbers
            // Remember that this will cost you depending on phone number type.
            // Amount will be deducted from your balance.
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