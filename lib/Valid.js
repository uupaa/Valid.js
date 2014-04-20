// @name: Valid.js
// @require: none
// @cutoff: @assert @node

(function Valid_js(global) {
"use strict";

// --- variable --------------------------------------------
var _inNode = "process" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function Valid() { // @help: Valid
}

Valid["repository"] = "https://github.com/uupaa/Valid.js";

Valid["type"]       = returnTrue;
Valid["keys"]       = returnTrue;
Valid["json"]       = returnTrue;
Valid["stack"]      = returnEmptyString;

//{@assert
Valid["type"]       = Valid_type;  // Valid.type(value:Any, types:String, validate:String/JSON = null):Boolean
Valid["keys"]       = Valid_keys;  // Valid.keys(value:Object, keys:String):Boolean
Valid["json"]       = Valid_json;  // Valid.json(json:Object, scheme:Object):Boolean
Valid["stack"]      = Valid_stack; // Valid.stack(message:String = "", depth:Integer = 3):String
//}@assert

// --- implement -------------------------------------------
function returnTrue() {
    return true;
}

function returnEmptyString() {
    return "";
}

//{@assert
function Valid_type(value,      // @arg Any:
                    types,      // @arg TypeString: eg: "Type1", "Type1/Type2/omit", "JSON"
                    validate) { // @arg String/SchemeJSON(= null):
                                // @ret Boolean:
                                // @help: Valid.type
    return types.split(/[\|\/]/).some(_judge);

    function _judge(type) {
        switch (type.toLowerCase()) {
        case "omit":        return value === undefined || value === null;
        case "null":        return value === null;
        case "undefined":   return value === undefined;
        case "array":       return Array.isArray(value);
        case "integer":     return typeof value === "number" && Math.ceil(value) === value;
        case "json":        return Valid_json(value, validate);
        case "typedarray":  return Valid_isTypedArray(value);
        case "object":  // typeof null -> object
            return (value || 0).constructor !== ({}).constructor ? false
                 : typeof validate === "string" ? Valid_keys(value, validate)
                                                : true;
        }
        if (value !== undefined && value !== null) {
            if (Object.prototype.toString.call(value) === "[object " + type + "]") {
                return true;
            } else if (value.constructor.name === type) {
                return true;
            }
        }
        return false;
    }
}
//}@assert

//{@assert
function Valid_isTypedArray(value) {
    return ["Int8Array", "Uint8Array", "Uint8ClampedArray",
            "Int16Array", "Uint16Array",
            "Int32Array", "Uint32Array",
            "Float32Array", "Float64Array"].some(function(typeName) {
                return Object.prototype.toString.call(value) === "[object " + typeName + "]";
            });
}
//}@assert

//{@assert
function Valid_keys(value,  // @arg Object: { key1, key2 }
                    keys) { // @arg String: valid choices. "key1,key2,key3"
                            // @ret Boolean: false is invalid value.
                            // @help: Valid.keys
    var items = keys.split(",");

    return Object.keys(value).every(function(key) {
        return items.indexOf(key) >= 0;
    });
}
//}@assert

//{@assert
function Valid_json(json,     // @arg JSONObject:
                    scheme) { // @arg JSONObject:
                              // @ret Boolean: false is invalid.
                              // @help: Valid.json
    var rv = _json(json, scheme, "");

    if (rv) {
        return true;
    }
    console.log("json: " + JSON.stringify(json, null, 2));
    console.log("scheme: " + JSON.stringify(scheme, null, 2));
    return false;
}
//}@assert

//{@assert
function _json(json, scheme, path) {
    path = path || "";
    return Object.keys(scheme).every(function(schemeKey) {
        var schemeType = Object.prototype.toString.call(scheme[schemeKey]).slice(8, -1);

        if (schemeKey in json) {
            if ( !Valid_type(json[schemeKey], schemeType) ) {
                console.error("Valid.json type missmatch: " + path + schemeKey + " is not " + schemeType);
                return false;
            } else if (schemeType === "Object" || schemeType === "Array") {
                return _json(json[schemeKey], scheme[schemeKey], path + schemeKey + ".");
            }
            return true;
        }
        console.error("Valid.json unknown property: " + path + schemeKey);
        return false;
    });
}
//}@assert

//{@assert
function Valid_stack(message, // @arg String(= ""):
                     depth) { // @arg Integer(= 3):
                              // @help: Valid.stack
    depth = depth || 3;
    var rv = "";

    try {
        throw new Error();
    } catch (o_o) {
        rv = (message || "") + "\n" +
             o_o.stack.split("\n").slice(depth).join("\n");
    }
    return rv;
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = Valid;
}
//}@node
if (global["Valid"]) {
    global["Valid_"] = Valid; // already exsists
} else {
    global["Valid"]  = Valid;
}

})((this || 0).self || global);

