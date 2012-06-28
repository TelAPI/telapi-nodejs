#! /usr/bin/env node

/**
 * 
 * Say and Play something with help of InboundXML and TelAPI
 *
 * --------------------------------------------------------------------------------
 * 
 * @category  TelApi Helper
 * @package   TelApi
 * @author    Nevio Vesic <nevio@telapi.com>
 * @license   http://creativecommons.org/licenses/MIT/ MIT
 * @copyright (2012) TelTech Systems, Inc. <info@telapi.com>
 */

var util        = require("util"); // For loging purposes :)

// Get TelAPI InboundXML helper
var InboundXML  = require('telapi').inboundxml;

// Initialize TelAPI response element. This is A MUST!
var response = new InboundXML.Response();

// Append Say element into response
response.append(
	new InboundXML.Say(
		'Example usage of TelAPI Node.JS InboundXML Play element', 
		{ voice : 'man' }
	)
);

// Append Play element into response
response.append(
	new InboundXML.Play(
		"http://funny-stuff.audio4fun.com/download/sounds/87.mp3"
	)
);

util.log("\n\nInboundXML Say and Play Element: \n\n" + response.toString())