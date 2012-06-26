#! /usr/bin/env node

var util       = require("util")
var Client     = require("../lib/client")

util.log("Starting out TelAPI InboundXML tests ...")
util.log("")
util.log("...........................................")



var client = new Client.TelAPI('ACadea151d708d45febbbb5104c98977ca', '096353c24f3845678de1f5f5f5a7d694');


var account = client.get('account');

client.get(['calls', 'CALLSID']);