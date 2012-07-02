#! /usr/bin/env node

/**
 * 
 * Retrieve the 10 newest account notifications with TelAPI
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

// Retrieve the 10 newest notifications in the TelAPI account
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