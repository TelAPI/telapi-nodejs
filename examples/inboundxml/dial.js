#! /usr/bin/env node

/**
 * 
 * Dial with help of InboundXML and TelAPI
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

// Number to display as calling. (A surcharge will apply when dialing via a custom From number. See pricing page).
// http://www.telapi.com/pricing
var from_number = '(XXX) XXX-XXXX';

// Number you wish to dial
var to_number   = '(XXX) XXX-XXXX';

// Append Dial element into response
response.append(
	new InboundXML.Dial( 
		to_number,
		{
			'callerId' : from_number,
			'action'   : 'http://liveoutput.com/inboundxmldial',
			'method'   : "POST"
		}
	)
);

util.log("\n\nInboundXML Dial Element: \n\n" + response.toString())