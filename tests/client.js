#! /usr/bin/env node

var util       = require("util")
var Client     = require("../lib/client")

util.log("Starting out TelAPI InboundXML tests ...")
util.log("")
util.log("...........................................")



var client = new Client.TelAPI('ACCOUNT_SID', 'AUTH_TOKEN');


var account = client.get('account');
