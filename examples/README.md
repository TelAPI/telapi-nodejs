## Run Instructions

In order to run files located under this path you will need to follow few easy steps. Runing them is very easy :) 

Once you choose desired example you will need to:


#### Step 1 - Change credentials

Every example file contains following block of the code:

```javascript
// Load configuration file
var configuration = require('./configuration');
```

which loads `configuration.js` file located under same path. File content is:

```javascript
module.exports = {

    // A 36 character long Account Sid is always required. It can be described
    // as the username for your account
    account_sid : 'ACCOUNT_SID',


    // A 34 character long Auth Token is always required. It can be described
    // as your account's password
    auth_token  : 'AUTH_TOKEN',

}
```

`ACCOUNT_SID` and `AUTH_TOKEN` must be changed with real credentials which you can find under [TelAPI dashboard](https://www.telapi.com/dashboard)


#### Step 2 - Change parameters ( if needed )

In case that choosen example is [Send SMS](https://github.com/TelAPI/telapi-nodejs/blob/master/examples/send_sms.js) you will need to update following block of the code:

```javascript
client.create(
    'sms_messages', 
    { 
        "From" : "(XXX) XXX-XXXX", 
        "To"   : "(XXX) XXX-XXXX", 
        "Body" : "Example message sent from TelAPI Node.JS helper"
    },
    function(response) { // SUCCESS CALLBACK
        util.log("SMS successfully sent. SMS SID: " + response.sid);
    },
    function(error) { // ERROR CALLBACK
        util.log("ERROR: " + error)
    }
);
```

where `From` and `To` must be real numbers.
    
    
#### Step 3 - Run the code!

There are many ways how code can be run. We will show you here how to run it from terminal:

```shell
cd telapi-nodejs/examples
node send_sms.js
```