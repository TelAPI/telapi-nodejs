telapi-nodejs
==========

This node.js library is an open source tool built to simplify interaction with the [TelAPI](http://telapi.com) telephony platform. TelAPI makes adding voice and SMS to applications fun and easy.

For more information about TelAPI, please visit:  [telapi.com/features](http://www.telapi.com/features) or [telapi.com/docs](http://www.telapi.com/docs)

---

Installation
============


#### Via npm
    
    npm install telapi

#### Via GitHub clone

Access terminal and run the following code:
```shell	
	$ cd ~
	$ git clone https://github.com/TelAPI/telapi-nodejs.git telapi-nodejs
    $ npm install ./telapi-nodejs
```

Usage
======

### REST

[TelAPI REST API documenatation](http://www.telapi.com/docs/api/rest/) 

##### Send SMS Example

```js
var util = require("util");
var Client = require('telapi').client;
 
var client = new Client(
    '********************************', 
    '********************************'
);
 
var options = {
    "sms_messages": {
        "from": "(XXX) XXX-XXXX",
        "to": "(XXX) XXX-XXXX",
        "body": "SMS message sent from the TelAPI Node.JS helper!"
    }
};

client.create(options, function (response) {
        util.log(
            "SmsMessage SID: " +  response.sid
        );
    },
    function (error) {
        util.log("Error: " + error)
    }
); 
```

### InboundXML

InboundXML is an XML dialect which enables you to control phone call flow. For more information please visit the [TelAPI InboundXML documenatation](http://www.telapi.com/docs/api/inboundxml/)

##### <Say> Example

```js
var util = require("util");
 
// Get TelAPI InboundXML helper
var InboundXML = require('telapi').inboundxml;
 
// Initialize TelAPI response element. This is A MUST!
var response = new InboundXML.Response();
 
response.append(
    new InboundXML.Say(
        'Welcome to TelAPI. This is a sample InboundXML document.',
        { voice : 'man'}
    )
);
 
util.log("\n\nInboundXML Say Element: \n\n" + response.toString()) 
```

will render

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="man">Welcome to TelAPI. This is a sample InboundXML document.</Say>
</Response>
```

---
