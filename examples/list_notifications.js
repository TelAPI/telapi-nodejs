#! /usr/bin/env node

/**
 * 
 * Retrieve latest 10 account notifications with TelAPI
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

// Retrieve latest 10 notifications of some specific TelAPI account
client.get(
    'notifications', 
    { 'PageSize' : 10 }, // Limit to 10 notifications per page
    function(response) { // SUCCESS CALLBACK

        util.log("Pagination details .........................................");

        util.log("");

        util.log("Current page is: " + response.page);
        util.log("Number of pages: " + response.num_pages);
        util.log("Current page size: " + response.page_size);
        util.log("Total records: " + response.total)

        util.log("");

        // Iterate through response notifications and display their respective SIDs
        for ( var notification in response.notifications ) {
            util.log("Notification SID: " + response.notifications[notification].sid);
        }

    },
    function(error) { // ERROR CALLBACK
        util.log("ERROR OCCURED: " + error)
    }
);