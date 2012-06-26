var util 		 = require('util'),
    EventEmitter = require('events').EventEmitter,
    TelapiSchema = require("./schemas/telapi.json");

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

        for(var j = 0; j < depth; j++) {
            stringified += '\t';
        }

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
            stringified += '>\n';

            if(typeof this.body == 'string') {
                for(var i = 0; i < depth + 1; i++) {
                    stringified += '\t';
                }

                stringified += this.body;
            } else {
                for(var k = 0; k < this.body.length; k++) {
                    stringified += this.body[k].toString(depth + 1);
                }
            }
            stringified += '\n';
            for(var l = 0; l < depth; l++) {
                stringified += '\t';
            }
            stringified += '</' + this.type + '>';
        } else {
            // Self-clsoing tag
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
 * Say class. Represents a InboundXML <Say> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/say/
 *
 * @param {String} body: (Required) The text to say
 * @param {Map} attrs: (Optional) Attributes for the xml object.
 *
 * (new InboundXML.Say('Hello', {voice: 'man', language: 'en'})).toString() returns:
 *
 * <Say voice="main" lanugage="en">
 *     Hello
 * </Say>
 *
 */
var Say = module.exports.Say = function Say(body, attrs) {
    if(!body) { throw new Error('Say requires a body arg.'); }
    
    this.type = 'Say';
    this.nestable = TelapiSchema.inboundxml.verbs.Say.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Say.attributes;
    Element.call(this, body, attrs);
};

/**
 * Play class. Represents a InboundXML <Play> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/play/
 *
 * @param {String} body: (Required) The URI of the file to play
 * @param {Map} attrs: (Optional) Attributes for this XML element.
 *
 * (new InboundXML.Play('http://mp3.com/', {loop: 2})).toString() returns:
 * 
 * <Play loop="2">
 *       http://mp3.com/
 * </Play>
 */
var Play = module.exports.Play = function Play(body, attrs) {
    if(!body) throw new Error('Play requires a URI to be set');
    
    this.type = 'Play';
    this.nestable = TelapiSchema.inboundxml.verbs.Play.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Play.attributes;

    Element.call(this, body, attrs);
};

/**
 * Gather glass. Represents a InboundXML <Gather> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/gather/
 *
 * @param {Mixed} body: (Optional) Either a Play, Say, or Pause element.
 * @param {Map} attrs: (Optional) Attributes for this XML element.
 *
 * var s = new InboundXML.Say('Please enter your PIN');
 * (new InboundXML.Gather(p, {digits: 4})).toString() returns:
 *
 * <Gather maxDigits="4">
 *     <Say>
 *          Please enter your PIN
 *     </Say>
 * </Gather>
 *
 */
var Gather = module.exports.Gather = function Gather(body, attrs) {
    var self = this;

    this.type = 'Gather';
    this.nestable = TelapiSchema.inboundxml.verbs.Gather.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Gather.attributes;

    if(typeof body == 'string') {
        throw new Error('Gather only accepts valid InboundXML element. Strings are not allowed!');
    }

    attrs = attrs || {};
    Element.call(this, body ? [body] : null, attrs);
};

/**
 * Record class. Represents a InboundXML <Record> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/record/
 *
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Record = module.exports.Record = function Record(attrs) {
    var self = this, uri;

    this.type = 'Record';
    this.nestable = TelapiSchema.inboundxml.verbs.Record.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Record.attributes;
    
    attrs = attrs || {};
    Element.call(this, null, attrs);
};

/**
 * SMS Message class. Represents a InboundXML <Sms> element.
 * See: http://www.telapi.com/docs/api/inboundxml/sms/sms/
 * 
 * @param {String} body: (Required) A string representing message.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Sms = module.exports.Sms = function Sms(body, attrs) {
    var self = this;
    
    if(!body) throw new Error('Sms verb requires body argument');

    this.type = 'Sms';
    this.nestable = TelapiSchema.inboundxml.verbs.Sms.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Sms.attributes;
    
    attrs = attrs || {};

    Element.call(this, body, attrs);
};


/**
 * Dial class. Represents a InboundXML <Dial> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/
 * 
 * @param {String} body: (Required) A string representing message.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Dial = module.exports.Dial = function Dial(body, attrs) {
    var self = this;
    
    this.type = 'Dial';
    this.nestable = TelapiSchema.inboundxml.verbs.Dial.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Dial.attributes;
    
    attrs = attrs || {};

    Element.call(this, body, attrs);
};


/**
 * Num class. Represents a InboundXML <Number> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/number/
 * 
 * @param {String} body: (Required) A string representing phone number.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Num = module.exports.Num = function Num(body, attrs) {
    if(!body) throw new Error('Num noun requires body argument');

    this.type = 'Number';
    this.nestable = TelapiSchema.inboundxml.verbs.Number.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Number.attributes;
    
    Element.call(this, body, attrs);
};


/**
 * Conference class. Represents a InboundXML <Conference> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/conference/
 * 
 * @param {String} body: (Required) A string representing conference name.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Conference = module.exports.Conference = function Conference(body, attrs) {
    if(!body) throw new Error('Conference noun requires body argument');

    this.type = 'Conference';
    this.nestable = TelapiSchema.inboundxml.verbs.Conference.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Conference.attributes;
    
    Element.call(this, body, attrs);
};

/**
 * Sip class. Represents a InboundXML <Sip> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/dial/sip/
 * 
 * @param {String} body: (Required) A string representing sip address.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Sip = module.exports.Sip = function Conference(body, attrs) {
    if(!body) throw new Error('Sip noun requires body argument');

    this.type = 'Sip';
    this.nestable = TelapiSchema.inboundxml.verbs.Sip.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Sip.attributes;
    
    Element.call(this, body, attrs);
};

/**
 * Hangup class. Represents a InboundXML <Hangup> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/hangup/
 * 
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Hangup = module.exports.Hangup = function Hangup(attrs) {
    this.type = 'Hangup';
    this.nestable = TelapiSchema.inboundxml.verbs.Hangup.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Hangup.attributes;

    Element.call(this, null, attrs);
};


/**
 * Redirect class. Represents a InboundXML <Redirect> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/redirect/
 * 
 * @param {String} uri: (Required) A string representing redirect-to url.
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Redirect = module.exports.Redirect = function Redirect(uri, attrs) {
    if(!uri) throw new Error('Redirect requires a uri argument');

    this.type = 'Redirect';
    this.nestable = TelapiSchema.inboundxml.verbs.Redirect.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Redirect.attributes;
    
    Element.call(this, uri, attrs);
};

/**
 * Reject class. Represents a InboundXML <Reject> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/reject/
 * 
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Reject = module.exports.Reject = function Reject(attrs) {
    this.type = 'Reject';
    this.nestable = TelapiSchema.inboundxml.verbs.Reject.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Reject.attributes;

    Element.call(this, null, attrs);
};

/**
 * Pause class. Represents a InboundXML <Pause> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/pause/
 * 
 * @param {Map} attrs: (Optional) A map of XML attributes for this element.
 */
var Pause = module.exports.Pause = function Pause(attrs) {
    this.type = 'Pause';
    this.nestable = TelapiSchema.inboundxml.verbs.Pause.nesting;
    this.allowed_attributes = TelapiSchema.inboundxml.verbs.Pause.attributes;

    Element.call(this, null, attrs);
};

/**
 * Response class. Represents a InboundXML <Response> element.
 * See: http://www.telapi.com/docs/api/inboundxml/voice/response/
 */
var Response = module.exports.Response = function Response() {
    this.body = [];
    
    this.append = function(node) {
        this.body.push(node);
        return this;
    };

    this.toString = function() {
        var str = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';
        for(var i = 0; i < this.body.length; i++) {
            str += this.body[i].toString(1) + '\n';
        }
        str += '</Response>\n';
        return str;
    };
};