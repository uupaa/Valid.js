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
var SPLITTER = /,|\x7c|\x2f/; // Value.keys(value, "a,b|c/d")
var TYPE_SYNONYMS = {
        "omit":      "Omit",
        "null":      "Null",
        "void":      "Undefined",
        "Void":      "Undefined",
        "undefined": "Undefined"
    };

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
Valid["some"]  = Valid_some;  // Valid.some(value:String, candidate:String|Object):Boolean
Valid["keys"]  = Valid_keys;  // Valid.keys(value:Object|undefined, keys:String):Boolean
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
                    types) { // @arg TypeNameString  "Type1", "Type1|Type2|omit"
                             //        NativeTypeNameString:  Array, Number, null ...
                             //        SpecialTypeNameString: Integer, TypedArray, omit ...
                             //        ComplexTypeNameString: URLString, FunctionArray ...
                             // @ret Boolean
    if (arguments.length >= 3) {
        throw new Error("The maximum length of Valid.type arguments are 2.");
    }
    return types.split(SPLITTER).some(_some);

    function _some(type) { // @arg NativeTypeNameString|SpecialTypeNameString|ComplexTypeNameString
                          // @ret Boolean
        type = TYPE_SYNONYMS[type] || type;

        // --- special keywords ---
        switch (type) {
        case "this":        return value instanceof global[_getBaseClassName(value)];
        case "Omit":        return value === null || value === undefined;
        case "Integer":     return typeof value === "number" && Math.ceil(value) === value;
        case "TypedArray":  return _isTypedArray(value);
        case "Null":        return value === null;
        case "Undefined":   return value === undefined;
        case "Array":       return Array.isArray(value);
        case "Object":      return (value || 0).constructor === ({}).constructor;
        }
        if (value === null || value === undefined) {
            return false;
        }

        var constructorName = _getConstructorName(value);
        var baseClassName   = _getBaseClassName(value);

        if (constructorName === type || baseClassName === type) {
            return true;
        }
        if (type in global) { // Is this global Class?
            return baseClassName === type;
        }

        // greedy complex type matching
        //
        //      "FooIntegerIDString" in global -> false
        //         "IntegerIDString" in global -> false
        //                "IDString" in global -> false
        //                  "String" in global -> true
        //
        var token = _splitComplexTypeName(type);

        if (token.length > 1) {
            for (var i = 0, iz = token.length; i < iz; ++i) {
                var compositeTypes = token.slice(i).join("");

                if (compositeTypes in global) {
                    return _some(compositeTypes);
                }
            }
        }
        return false;
    }
}

function _splitComplexTypeName(type) { // @arg PascalCaseString "FooIntegerIDString"
                                       // @ret StringArray ["Foo", "Integer", "ID", "String"]
    var token = [];

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
    return token;
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

function Valid_some(value,       // @arg String         - "a"
                    candidate) { // @arg Object|String  - "a|b|c"
                                 // @ret Boolean - true -> has, false -> has not
    var keys = typeof candidate === "string"              ? candidate.split(SPLITTER)
             : candidate.constructor === ({}).constructor ? Object.keys(candidate)
             : [];

    return keys.some(function(token) {
        return value === token;
    });
}

function Valid_keys(value,  // @arg Object|undefined  { key1, key2 }
                    keys) { // @arg String            valid choices. "a,b" or "a|b" or "a/b"
                            // @ret Boolean           false is invalid value.
    if (value === null || value === undefined) {
        return true; // [!]
    }
    if (value.constructor === ({}).constructor) {
        var items = keys.replace(/ /g, "").split(SPLITTER);

        return Object.keys(value).every(function(key) {
            return items.indexOf(key) >= 0;
        });
    }
    return false;
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
if ("process" in global) {
    module["exports"] = Valid;
}
global["Valid" in global ? "Valid_" : "Valid"] = Valid; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom

