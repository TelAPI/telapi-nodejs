# telapi-nodejs

A Node.js TelAPI helper library which provides a low-level interface for making REST requests to TelAPI and InboundXML, to help you control your voice calls. 
REST client functionality is contained in lib/client.js, and maps pretty much one-to-one with the [`TelAPI REST API documentation`](http://www.telapi.com/docs/api/rest/).

Each method accepts a callback function that returns the HTTP response object resulting from the API request, as well as the options specific to that call.

The low-level REST API, while helpful, is little more than a simple wrapper around the Node HTTP library. It takes care of the HTTP Basic auth, ensuring all your parameters are serialized properly, unmarshalling the responses (we use the JSON representation from TelAPI), and letting you, the developer, use the responses.

The InboundXML helper functionality is contained in lib/inboundxml.js and maps pretty much one-to-one with the [`TelAPI InboundXML API documentation`](http://www.telapi.com/docs/api/inboundxml/).

InboundXML is TelAPI's method of helping you control how TelAPI should deal with your inbound calls and SMS messages. You can `Gather` digits, `Say` something to a caller or even `Dial` to another number with custom properties such as `callerId`.  

## Installation


To install via npm:
    
    npm install telapi

To install by hand, download the module and run the npm installation in the local directory
	
	$ cd ~
	$ git clone https://github.com/teltechsystems/telapi-nodejs.git telapi-nodejs
    $ npm install ./telapi-nodejs

## Usage

To start, you'll need to obtain a TelAPI account. (http://www.telapi.com). This will give you a TelAPI Account Sid and a TelAPI Auth Token. Using these, you can start using Node to build awesome telephony apps with TelAPI.

To really get down to business, check out [`the documentation`](http://www.telapi.com/docs) or check out [`examples`](https://github.com/teltechsystems/telapi-nodejs/tree/master/examples)