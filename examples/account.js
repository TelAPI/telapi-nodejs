#! /usr/bin/env node

/**
 * 
 * Retrieve account details with TelAPI
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

// Retrieve specific account details. 
client.get(
    'account', 
    null,
    function(response) { // SUCCESS CALLBACK
        util.log("Account successfully retrieved. Your account balance is: " + response.account_balance);
    },
    function(error) { // ERROR CALLBACK
        util.log("ERROR OCCURED: " + error)
    }
);


