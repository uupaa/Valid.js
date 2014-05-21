(function(global) {
"use strict";

// --- dependency module -----------------------------------
// --- local variable --------------------------------------
var _inNode = "process" in global;

// --- define ----------------------------------------------
var TYPED_ARRAYS = [
        "Int8Array", "Uint8Array", "Uint8ClampedArray",
        "Int16Array", "Uint16Array",
        "Int32Array", "Uint32Array",
        "Float32Array", "Float64Array"
    ];
var SPLITTER = /,|\x7c|\x2f/; // "a,b" or "a|b" or "a/b"

// --- interface -------------------------------------------
function Valid(value,       // @arg Boolean
               api,         // @arg Function
               highlihgt) { // @arg String = ""
    if (!value) {
        if (global["Help"]) {
            global["Help"](api, highlihgt || "");
        }
        throw new Error(api["name"] + "(" + highlihgt + ") is invalid value.");
    }
}

Valid["repository"] = "https://github.com/uupaa/Valid.js";

Valid["args"]  = Valid_args;  // Valid.args(api:Function, args:Array|ArrayLike):void
Valid["type"]  = Valid_type;  // Valid.type(value:Any, types:String):Boolean
Valid["keys"]  = Valid_keys;  // Valid.keys(value:Any, keys:String):Boolean
Valid["json"]  = Valid_json;  // Valid.json(json:Object, scheme:Object):Boolean
Valid["stack"] = Valid_stack; // Valid.stack(message:String = "", depth:Integer = 3):String

// --- implement -------------------------------------------
function Valid_args(api,    // @arg Function
                    args) { // @arg Array|ArrayLike
    if (global["Reflection"]) {
        global["Reflection"]["getFunctionAttribute"](api, "arg")["arg"].forEach(function(item, index) {
            var type = item["type"];

            if (item["optional"]) {
                type += "|omit";
            }
            if ( !Valid_type(args[index], type) ) {
                if (global["Help"]) {
                    global["Help"](api, item["name"]);
                }
                throw new Error(api["name"] + "(" + item["name"] + ") is invalid type.");
            }
        });
    }
}

function Valid_type(value,   // @arg Any
                    types) { // @arg TypeString  eg: "Type1", "Type1|Type2|omit"
                             // @ret Boolean
    if (arguments.length >= 3) {
        throw new Error("The maximum length of Valid.type arguments are 2.");
    }
    return types.split(SPLITTER).some(_judge);

    function _judge(type) {
        switch (type) {
        case "omit":        return value === null || value === undefined;
        case "null":        return value === null;
        case "undefined":   return value === undefined;
        case "Array":       return Array.isArray(value);
        case "Integer":     return typeof value === "number" && Math.ceil(value) === value;
        case "TypedArray":  return _isTypedArray(value);
        case "Object":      return (value || 0).constructor === ({}).constructor;
        }
        if (value === null || value === undefined) {
            return false;
        }
        if ( _getConstructorName(value) === type ||
             _getBaseClassName(value)   === type ) {
            return true;
        }
        if (type in global) {
            return _getBaseClassName(value) === type;
        }

        // type: "NODEBarPooIntegerString" -> token: ["NODEBar", "Poo", "Integer", "String"]
        var token = [];

        type.replace(/[A-Z]+[a-z0-9]+/g, function(_) {
            token.push(_);
        });

        type.replace(/([A-Z]+)[a-z0-9]+/g, function(_, a) {
            if (a.length === 1) {
                // "String" -> { _: "String", a: "S" }
                token.push(_);
            } else {
                // "IDString" -> { _: "IDString", a: "IDS" }
                token.push( _.slice(0, a.length - 1) ); // "ID"
                token.push( _.slice(a.length - 1) );    // "String"
            }
        });

        // greedy complex type matching.
        //
        //      "NODEBarPooIntegerString" in global -> false
        //             "PooIntegerString" in global -> false
        //                "IntegerString" in global -> false
        //                       "String" in global -> true
        //
        if (token.length > 1) {
            for (var i = 0, iz = token.length; i < iz; ++i) {
                var compositeTypes = token.slice(i).join("");

                if (compositeTypes in global) {
                    return _judge(compositeTypes);
                }
            }
        }
        return false;
    }
}

function _getBaseClassName(value) { // @arg Any
                                    // @ret String
    // Object.prototype.toString.call(new Error());     -> "[object Error]"
    // Object.prototype.toString.call(new TypeError()); -> "[object Error]"
    return Object.prototype.toString.call(value).split(" ")[1].slice(0, -1); // -> "Error"
}

function _getConstructorName(value) { // @arg Any   instance, exclude null and undefined.
                                      // @ret String
    // _getConstructorName(new (function Aaa() {})); -> "Aaa"
    return value.constructor["name"] ||
          (value.constructor + "").split(" ")[1].split("\x28")[0]; // for IE
}

function _isTypedArray(value) { // @arg Any
                                // @ret Boolean
    var className = _getBaseClassName(value).toLowerCase();

    return TYPED_ARRAYS.some(function(typeName) {
                return className === typeName.toLowerCase();
            });
}

function Valid_keys(value,  // @arg Any       { key1, key2 }
                    keys) { // @arg String    valid choices. "a,b" or "a|b" or "a/b"
                            // @ret Boolean   false is invalid value.
    if (value === null || value === undefined) {
        return true; // [!]
    }
    var items = keys.replace(/ /g, "").split(SPLITTER);

    return Object.keys(value).every(function(key) {
        return items.indexOf(key) >= 0;
    });
}

function Valid_json(json,     // @arg JSONObject
                    scheme) { // @arg JSONObject
                              // @ret Boolean   false is invalid.
    var rv = _json(json, scheme, "");

    if (rv) {
        return true;
    }
    console.log("json: " + JSON.stringify(json, null, 2));
    console.log("scheme: " + JSON.stringify(scheme, null, 2));
    return false;
}

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

function Valid_stack(message, // @arg String = ""
                     depth) { // @arg Integer = 3
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

// --- export ----------------------------------------------
if (_inNode) {
    module["exports"] = Valid;
}
if (global["Valid"]) {
    global["Valid_"] = Valid; // secondary
} else {
    global["Valid"]  = Valid; // primary
}

})((this || 0).self || global); // WebModule idiom

