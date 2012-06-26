#! /usr/bin/env node

var util       = require("util")
var InboundXML = require("../lib/inboundxml")
var testsch    = require("../lib/schemas/telapi.json")

util.log("Starting out TelAPI InboundXML tests ...")
util.log("")
util.log("...........................................")

// Starting out SAY Element
util.log("SAY ELEMENT START")

var say = new InboundXML.Say("I am saying InboundXML from Node.JS helper", { voice : "man" });

util.log( say.toString() )

util.log("SAY ALLOWED  ATTRIBUTES: " + say.listAllowedAttributes())
util.log("SAY NESTABLE ELEMENTS: "   + say.listNestableElements())

util.log("SAY ELEMENT END")
util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("PLAY ELEMENT START")


var play = new InboundXML.Play('http://www.example.com/example-audio.mp3', {loop: 2});

util.log( play.toString() )

util.log("PLAY ALLOWED  ATTRIBUTES: " + play.listAllowedAttributes())
util.log("PLAY NESTABLE ELEMENTS: "   + play.listNestableElements())


util.log("PLAY ELEMENT END")
util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("GATHER ELEMENT START")

var gather = new InboundXML.Gather(
	new InboundXML.Say('Please enter your PIN'),
	{numDigits : 4}
);

util.log( gather.toString() )

util.log("GATHER ALLOWED  ATTRIBUTES: " + gather.listAllowedAttributes())
util.log("GATHER NESTABLE ELEMENTS: "   + gather.listNestableElements())

util.log("GATHER ELEMENT END")
util.log("")

util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("RECORD ELEMENT START")

var record = new InboundXML.Record({
	action : "http://liveoutput.com/recordnodeaction",
	method : "POST"
});

util.log( record.toString() )

util.log("RECORD ALLOWED  ATTRIBUTES: " + record.listAllowedAttributes())
util.log("RECORD NESTABLE ELEMENTS: "   + record.listNestableElements())

util.log("RECORD ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("SMS ELEMENT START")

var sms = new InboundXML.Sms(
	"SMS Message sent with help of TelAPI Node.JS helper",
	{
		from   : "(XXX) XXX-XXXX",
		to     : "(XXX) XXX-XXXX",
		action : "http://liveoutput.com/smsnodeaction",
		method : "POST"
	}
);

util.log( sms.toString() )

util.log("SMS ALLOWED  ATTRIBUTES: " + sms.listAllowedAttributes())
util.log("SMS NESTABLE ELEMENTS: "   + sms.listNestableElements())

util.log("SMS ELEMENT END")

util.log("")
util.log("...........................................")