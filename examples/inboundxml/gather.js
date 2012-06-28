#! /usr/bin/env node

/**
 * 
 * Gather with help of InboundXML and TelAPI
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


// Append Dial element into response
response.append(
	new InboundXML.Gather( 
		
		new InboundXML.Say("Please enter your 4 digit pin", { voice : 'woman' }),

		{
			action      : 'http://liveoutput.com/gatherexample',
			method      : "POST",
			numDigits   : 4,
			finishOnKey : '#'
		}
	)
);

util.log("\n\nInboundXML Gather Element: \n\n" + response.toString())
