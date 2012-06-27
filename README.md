# telapi-nodejs

A Node.js TelAPI helper library which provides a low-level interface for making requests of TelAPI. This functionality is contained in lib/client.js, and maps pretty much one-to-one with the [`TelAPI REST API documentation`](http://www.telapi.com/docs/api/rest/).

Each method accepts a callback function that returns the HTTP response object resulting from the API request, as well as options specific to that call.

The low-level REST Api, whil helpful, is little more than a simple wrapper around the node HTTP library. It takes care of the HTTP Basic auth, ensuring all your parameters are serialized properly, unmarshalling the responses (which we use purely the JSON representation from TelAPI), and letting you, the developer, use the responses.

## Installation


To install via npm:
    
    npm install telapi

To install by hand, download the module and create a symlink in `~/.node_libraries`

    $ ln -s /path/to/telapi-nodejs ~/.node-libraries/telapi


## Usage

To start, you'll need to obtain a TelAPI account. (http://www.telapi.com). This will give you a TelAPI Account Sid and a TelAPI Auth Token. Using these, you may start using node for complex, awesome telephony applications.

To really get down to business, check out [`the documentation`](http://www.telapi.com/docs/api/rest/) or check out [`examples`](https://github.com/teltechsystems/telapi-nodejs/tree/master/examples)