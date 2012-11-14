/**
 * telapi
 * Copyright (c) 2012 TelTech Systems Inc. <info@telapi.com>
 * MIT Licensed
 */
 
var util         = require('util'),
    telapi_schema = require("./schemas/telapi.json");

/**
 * Element 'virtual' class. Base class for all InboundXML elements.
 * Element defines three methods for all subclasses:
 * Element.append(node): Append a node to the body of this node
 * Element.attr(attr, val): Add an XML attribute called attr with value val to this node
 * Element.toString: Render this node (and all contained nodes) as valid XML.
 */
function Element(body, attrs) {
    this.body = body || [];
    this.attrs = attrs || {};

    this.verifyBody = function() {
        if(typeof this.body == 'object' && this.body.length > 0) {
            for(var i = 0; i < this.body.length; i++) {
                var curNode = this.body[i];
                if(!this._isNestable(curNode.type)) {
                    throw new Error('Cannot nest ' + curNode.type + 
                        ' Verb in ' + this.type + ' verb');
                }
            }
        }
    };

    this.verifyAttrs = function() {
        for(var key in this.attrs) {
            if(!this._isAttribute(key)) {
                throw new Error(
                    "Attribute '"+key+"' cannot be set for '"+ this.type + 
                    "' InboundXML element. Attribute does not exists!"
                );
            }
        }
    };

    this._isNestable  = function(element_name) {
        for(var key in this.nestable) {
            if(this.nestable[key] == element_name) return true;
        }
        return false;
    }

    this._isAttribute = function(value) {
        for(var key in this.allowed_attributes) {
            if (this.allowed_attributes[key] == value) return true;
        }
        return false;
    }

    this.append = function(node) {
        if(!this.body) {
            this.body = [];
        }

        this.body.push(node);
        this.verifyBody();
        return this;
    };
    
    this.attr = function(attr, value) {
        this.attrs[attr] = value;
        this.verifyAttrs();
    };
    
    this.toString = function(depth) {
        var stringified = '';

        depth = depth || 0;

        stringified += '<' + this.type;

        function quoteAttribute(attr) {
            if(attr[0] != '"') {
                return '"' + attr + '"';
            }
            return attr;
        }

        for(var key in this.attrs) {
            stringified += ' ' + key + '=' + quoteAttribute(this.attrs[key]);
        }

        if(this.body.length > 0) {
            stringified += '>';

            if(typeof this.body == 'string') {
                stringified += this.body;
            } else {
                for(var k = 0; k < this.body.length; k++) {
                    stringified += this.body[k].toString(depth + 1);
                }
            }
            stringified += '</' + this.type + '>';
        } else {
            // Smamp cp
            stringified += '/>';
        }
        
        
        return stringified;
    };

    this.listAllowedAttributes = function() {
        return this.allowed_attributes;
    }

    this.listNestableElements  = function() {
        return this.nestable;
    }

    this.verifyBody();
    this.verifyAttrs();
}

/**
 * Say class. Represents an InboundXML <Say> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/say/
 *
 * @param {String} body: (Required) The text to say
 * @param {Map} attrs: (Optional) Attributes for the xml object.
 *
 * (new InboundXML.Say('Hello', {voice: 'man', language: 'en'})).toString() returns:
 */
var Say = module.exports.Say = function Say(body, attrs) {
    if(!body) { throw new Error('Say requires a body argument'); }
    
    this.type = 'Say';
    this.nestable = telapi_schema.inboundxml.verbs.Say.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Say.attributes;
    Element.call(this, body, attrs);
};

/**
 * Play class. Represents an InboundXML <Play> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/play/
 *
 * @param {String} body: (Required) The URI of the file to play
 * @param {Map} attrs: (Optional) Attributes for this XML element.
 *
 */
var Play = module.exports.Play = function Play(body, attrs) {
    if(!body) throw new Error('Play requires a URI to be set');
    
    this.type = 'Play';
    this.nestable = telapi_schema.inboundxml.verbs.Play.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Play.attributes;

    Element.call(this, body, attrs);
};

/**
 * Gather class. Represents an InboundXML <Gather> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/gather/
 *
 * @param {Mixed} body: (Optional) Either a Play, Say, or Pause element.
 * @param {Map} attrs: (Optional) Attributes for this XML element.
 *
 */
var Gather = module.exports.Gather = function Gather(body, attrs) {
    var self = this;

    this.type = 'Gather';
    this.nestable = telapi_schema.inboundxml.verbs.Gather.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Gather.attributes;

    if(typeof body == 'string') {
        throw new Error('Gather only accepts valid InboundXML element. Strings are not allowed!');
    }

    attrs = attrs || {};
    Element.call(this, body ? [body] : null, attrs);
};

/**
 * Record class. Represents an InboundXML <Record> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/record/
 *
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Record = module.exports.Record = function Record(attrs) {
    var self = this, uri;

    this.type = 'Record';
    this.nestable = telapi_schema.inboundxml.verbs.Record.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Record.attributes;
    
    attrs = attrs || {};
    Element.call(this, null, attrs);
};

/**
 * GetSpeech class. Represents an InboundXML <Gather> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/gather/
 *
 * @param {Mixed} body: (Optional) Either a Play, Say, or Pause element.
 * @param {Map} attrs: (Optional) Attributes for this XML element.
 *
 */
var GetSpeech = module.exports.GetSpeech = function GetSpeech(body, attrs) {
    var self = this;

    this.type = 'GetSpeech';
    this.nestable = telapi_schema.inboundxml.verbs.GetSpeech.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.GetSpeech.attributes;

    if(typeof body == 'string') {
        throw new Error('GetSpeech only accepts valid InboundXML element. Strings are not allowed!');
    }

    attrs = attrs || {};
    Element.call(this, body ? [body] : null, attrs);
};

/**
 * SMS Message class. Represents an InboundXML <Sms> element.
 * See: http://www.telapi.com/docs/api/inboundxml/sms/sms/
 * 
 * @param {String} body: (Required) A string representing message.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Sms = module.exports.Sms = function Sms(body, attrs) {
    var self = this;
    
    if(!body) throw new Error('Sms verb requires a body argument');
    
    body = body.replace("<", "&lt;");
    body = body.replace(">", "&gt;");
    
    this.type = 'Sms';
    this.nestable = telapi_schema.inboundxml.verbs.Sms.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Sms.attributes;
    
    attrs = attrs || {};

    Element.call(this, body, attrs);
};


/**
 * Dial class. Represents an InboundXML <Dial> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/
 * 
 * @param {String} body: (Required) A string representing message.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Dial = module.exports.Dial = function Dial(body, attrs) {
    
    this.type = 'Dial';
    this.nestable = telapi_schema.inboundxml.verbs.Dial.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Dial.attributes;
    
    attrs = attrs || {};
    
    if(typeof body == 'string') {
        Element.call(this, body, attrs);
    } else {
        Element.call(this, body ? [body] : null, attrs);
    }
};


/**
 * Num class. Represents an InboundXML <Number> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/number/
 * 
 * @param {String} body: (Required) A string representing phone number.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Num = module.exports.Num = function Num(body, attrs) {
    if(!body) throw new Error('Num noun requires a body argument');

    this.type = 'Number';
    this.nestable = telapi_schema.inboundxml.verbs.Number.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Number.attributes;
    
    Element.call(this, body, attrs);
};


/**
 * Conference class. Represents an InboundXML <Conference> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/conference/
 * 
 * @param {String} body: (Required) A string representing conference name.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Conference = module.exports.Conference = function Conference(body, attrs) {
    if(!body) throw new Error('Conference noun requires a body argument');

    this.type = 'Conference';
    this.nestable = telapi_schema.inboundxml.verbs.Conference.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Conference.attributes;
    
    Element.call(this, body, attrs);
};

/**
 * Sip class. Represents an InboundXML <Sip> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/sip/
 * 
 * @param {String} body: (Required) A string representing sip address.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Sip = module.exports.Sip = function Conference(body, attrs) {
    if(!body) throw new Error('Sip noun requires a body argument');
    this.type = 'Sip';
    this.nestable = telapi_schema.inboundxml.verbs.Sip.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Sip.attributes;
    
    Element.call(this, body, attrs);
};

/**
 * Hangup class. Represents an InboundXML <Hangup> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/hangup/
 * 
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Hangup = module.exports.Hangup = function Hangup(attrs) {
    this.type = 'Hangup';
    this.nestable = telapi_schema.inboundxml.verbs.Hangup.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Hangup.attributes;

    Element.call(this, null, attrs);
};


/**
 * Redirect class. Represents an InboundXML <Redirect> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/redirect/
 * 
 * @param {String} uri: (Required) A string representing redirect-to url.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Redirect = module.exports.Redirect = function Redirect(uri, attrs) {
    if(!uri) throw new Error('Redirect requires a URI to be set');

    this.type = 'Redirect';
    this.nestable = telapi_schema.inboundxml.verbs.Redirect.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Redirect.attributes;
    
    Element.call(this, uri, attrs);
};

/**
 * Reject class. Represents an InboundXML <Reject> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/reject/
 * 
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Reject = module.exports.Reject = function Reject(attrs) {
    this.type = 'Reject';
    this.nestable = telapi_schema.inboundxml.verbs.Reject.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Reject.attributes;

    Element.call(this, null, attrs);
};

/**
 * Pause class. Represents an InboundXML <Pause> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/pause/
 * 
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Pause = module.exports.Pause = function Pause(attrs) {
    this.type = 'Pause';
    this.nestable = telapi_schema.inboundxml.verbs.Pause.nesting;
    this.allowed_attributes = telapi_schema.inboundxml.verbs.Pause.attributes;

    Element.call(this, null, attrs);
};

/**
 * Response class. Represents an InboundXML <Response> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/response/
 */
var Response = module.exports.Response = function Response() {
    this.body = [];
    
    this.append = function(node) {
        this.body.push(node);
        return this;
    };

    this.toString = function() {
        var str = '<?xml version="1.0" encoding="UTF-8"?><Response>';
        for(var i = 0; i < this.body.length; i++) {
            str += this.body[i].toString(1);
        }
        str += '</Response>';
        return str;
    };
};