#! /usr/bin/env node

var util       = require("util")
var InboundXML = require("../lib/inboundxml")

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


// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("DIAL ELEMENT START")

var dial = new InboundXML.Dial("(XXX) XXX-XXXX", {
	action : "http://example.com/dial-element-action",
	method : "GET",
	hangupOnStar : true
});

util.log( dial.toString() )

util.log("DIAL ALLOWED  ATTRIBUTES: " + dial.listAllowedAttributes())
util.log("DIAL NESTABLE ELEMENTS: "   + dial.listNestableElements())

util.log("DIAL ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("NUM ELEMENT START")

var num = new InboundXML.Num("(XXX) XXX-XXXX", {});

util.log( num.toString() )

util.log("NUM ALLOWED  ATTRIBUTES: " + num.listAllowedAttributes())
util.log("NUM NESTABLE ELEMENTS: "   + num.listNestableElements())

util.log("NUM ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("CONFERENCE ELEMENT START")

var conference = new InboundXML.Conference("Example Conference", {
	stayAlone : true
});

util.log( conference.toString() )

util.log("CONFERENCE ALLOWED  ATTRIBUTES: " + conference.listAllowedAttributes())
util.log("CONFERENCE NESTABLE ELEMENTS: "   + conference.listNestableElements())

util.log("CONFERENCE ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("SIP ELEMENT START")

var sip = new InboundXML.Sip("example@sip.com", {
	action : "http://example.com/sip-element-action",
	method : "GET",
});

util.log( sip.toString() )

util.log("SIP ALLOWED  ATTRIBUTES: " + sip.listAllowedAttributes())
util.log("SIP NESTABLE ELEMENTS: "   + sip.listNestableElements())

util.log("SIP ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("HANGUP ELEMENT START")

var hangup = new InboundXML.Hangup();

util.log( hangup.toString() )

util.log("HANGUP ALLOWED  ATTRIBUTES: " + hangup.listAllowedAttributes())
util.log("HANGUP NESTABLE ELEMENTS: "   + hangup.listNestableElements())

util.log("HANGUP ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("REDIRECT ELEMENT START")

var redirect = new InboundXML.Redirect("http://redirect-me-to.com", {
	method : 'POST'
});

util.log( redirect.toString() )

util.log("REDIRECT ALLOWED  ATTRIBUTES: " + redirect.listAllowedAttributes())
util.log("REDIRECT NESTABLE ELEMENTS: "   + redirect.listNestableElements())

util.log("REDIRECT ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("PAUSE ELEMENT START")

var pause = new InboundXML.Pause({
	length : 5
});

util.log( pause.toString() )

util.log("PAUSE ALLOWED  ATTRIBUTES: " + pause.listAllowedAttributes())
util.log("PAUSE NESTABLE ELEMENTS: "   + pause.listNestableElements())

util.log("PAUSE ELEMENT END")

util.log("")
util.log("...........................................")

// ----------------------------------------------------------------------------------------------------

util.log("")
util.log("RESPONSE ELEMENT START")

var response = new InboundXML.Response();

response.append(say);
response.append(dial);

util.log( response.toString() )

util.log("RESPONSE ELEMENT END")

util.log("")
util.log("...........................................")