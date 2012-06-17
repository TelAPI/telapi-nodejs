#! /usr/bin/env node

var util       = require("util")
var InboundXML = require("../lib/inboundxml")
var testsch    = require("../lib/schemas/telapi.json")

util.log("Starting out TelAPI InboundXML tests ...")

util.log("...........................................")

// Starting out SAY Element
util.log("SAY ELEMENT START")
util.log( new InboundXML.Say("I am saying InboundXML from Node.JS helper", { voices : "man" }).toString())
util.log("SAY ELEMENT END")

util.log("...........................................")



util.log("...........................................")

//util.log(TelapiSchema.inboundxml.verbs.Say.attributes)