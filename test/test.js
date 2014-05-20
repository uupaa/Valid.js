var ModuleTestValid = (function(global) {

return new Test("Valid", {
        disable:    false,
        node:       true,
        browser:    true,
        worker:     true,
        button:     true,
        both:       false,
    }).add([
        testValidComplexTypes,
        testValidType,
        testValidKeys,
        testValidJSON,
        testValidTypedArray,
      //testValidTypeLowerCase
    ]).run().clone();


function testValidComplexTypes(next) {

    var items = {
            0: Valid.type({}, "SubjectObject|omit"),
            1: Valid.type(null, "NullObject|omit"),
            2: Valid.type(undefined, "UndefinedObject|omit"),
            3: Valid.type(123, "HeyNumber"),
            4: Valid.type(/a/, "HogeRegExp"),
            5: Valid.type([], "StringArray"),
            6: Valid.type([], "IntegerArray/JSONObject"),
            7: Valid.type(new Task(1, function(){}), "HogeTask"),
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testValidType(next) {

    var rv = [
            Valid.type({}, "Object|omit"),          // 0
            Valid.type(null, "Object|omit"),        // 1
            Valid.type(undefined, "Object|omit"),   // 2
            Valid.type(123, "Number"),              // 3
            Valid.type(123.4, "Number"),            // 4
            Valid.type(-123, "Number"),             // 5
            Valid.type(-123.4, "Number"),           // 6
            Valid.type(123, "Integer"),             // 7
           !Valid.type(123.4, "Integer"),           // 8
            Valid.type(-123, "Integer"),            // 9
           !Valid.type(-123.4, "Integer"),          // 10
            Valid.type("", "String"),               // 11
            Valid.type("a", "String"),              // 12
           !Valid.type(123, "String"),              // 13
            Valid.type(/a/, "RegExp"),              // 14
           !Valid.type("", "RegExp"),               // 15
            Valid.type([], "Array"),                // 16
            Valid.type([], "Array/Object"),         // 17
            Valid.type([], "Object|Array"),         // 18
            Valid.type([], "Object|Array|omit"),    // 19
            Valid.type(false, "Boolean"),           // 20
            Valid.type(true, "Boolean"),            // 21
           !Valid.type(0, "Boolean"),               // 22
           !Valid.type("", "Boolean"),              // 23
           !Valid.type(null, "Boolean"),            // 24
           !Valid.type(undefined, "Boolean"),       // 25
//            Valid.type({ a: 1, b: 2 }, "Object/omit", "a,b"), // 26
//            Valid.type({ a: 1, b: 2, c: 0 }, "JSON/omit", { a: 0, b: 0, c: 0 }), // 27
//           !Valid.type({ a: 1, b: 2, c: {} }, "JSON/omit", { a: 0, b: 0, c: 0 }), // 28
//            Valid.type({ a: 1, b: 2, c: { d: 1 } }, "JSON/omit", { a: 0, b: 0, c: { d: 0 } }), // 29
            Valid.type(new Task(1, function(){}), "Task"), // 30
            Valid.type(null, "null"),               // 31
            Valid.type(undefined, "undefined"),     // 32
        ];

    if (/false/.test(rv.join())) {
        next && next.miss();
    } else {
        next && next.pass();
    }
}

function testValidKeys(next) {

    var rv = [
            Valid.keys({}, "key1/key2/key3"),
           !Valid.keys({ hey: 1 }, "key1|key2|key3"),
            Valid.keys({ key1: 1, key2: 2 }, "key1,key2"),
           !Valid.keys({ key1: 1, key2: 2, key3: 3 }, "key1,key2"),
        ];

    if (/false/.test(rv.join())) {
        next && next.miss();
    } else {
        next && next.pass();
    }
}

function testValidJSON(next) {
    var json = {
            a: 1,
            b: 2,
            c: [1,2,3],
            d: {
                d: "hogehoge",
                e: {
                }
            }
        };

    var scheme = {
            c: [0,0,0],
            b: 0,
            a: 0,
            d: {
                d: "",
                e: {
                }
            }
        };

    var rv = Valid.json(json, scheme);

    if (rv) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testValidTypedArray(next) {

    var items = {
            1: Valid.type(new Int8Array(1), "Int8Array"),
            2: Valid.type(new Uint8Array(1), "Uint8Array"),
            3: Valid.type(new Uint8ClampedArray(1), "Uint8ClampedArray"),
            4: Valid.type(new Int16Array(1), "Int16Array"),
            5: Valid.type(new Uint16Array(1), "Uint16Array"),
            6: Valid.type(new Int32Array(1), "Int32Array"),
            7: Valid.type(new Uint32Array(1), "Uint32Array"),
            8: Valid.type(new Float32Array(1), "Float32Array"),
            9: Valid.type(new Float64Array(1), "Float64Array"),
            10: !Valid.type(new Array(1), "Uint32Array"),
            11: !Valid.type(new Float64Array(1), "Uint32Array"),
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

/*
function testValidTypeLowerCase(next) {

    var rv = [
            Valid.type({}, "object/omit"),          // 0
            Valid.type(null, "object/omit"),        // 1
            Valid.type(undefined, "object/omit"),   // 2
            Valid.type(123, "number"),              // 3
            Valid.type(123.4, "number"),            // 4
            Valid.type(-123, "number"),             // 5
            Valid.type(-123.4, "number"),           // 6
            Valid.type(123, "integer"),             // 7
           !Valid.type(123.4, "integer"),           // 8
            Valid.type(-123, "integer"),            // 9
           !Valid.type(-123.4, "integer"),          // 10
            Valid.type("", "string"),               // 11
            Valid.type("a", "string"),              // 12
           !Valid.type(123, "string"),              // 13
            Valid.type(/a/, "regexp"),              // 14
           !Valid.type("", "regexp"),               // 15
            Valid.type([], "array"),                // 16
            Valid.type([], "array/object"),         // 17
            Valid.type([], "object/array"),         // 18
            Valid.type([], "object/array/omit"),    // 19
            Valid.type(false, "boolean"),           // 20
            Valid.type(true, "boolean"),            // 21
           !Valid.type(0, "boolean"),               // 22
           !Valid.type("", "boolean"),              // 23
           !Valid.type(null, "boolean"),            // 24
           !Valid.type(undefined, "boolean"),       // 25
//            Valid.type({ a: 1, b: 2 }, "object/omit", "a,b"), // 26
//            Valid.type({ a: 1, b: 2, c: 0 }, "json/omit", { a: 0, b: 0, c: 0 }), // 27
//           !Valid.type({ a: 1, b: 2, c: {} }, "json/omit", { a: 0, b: 0, c: 0 }), // 28
//            Valid.type({ a: 1, b: 2, c: { d: 1 } }, "json/omit", { a: 0, b: 0, c: { d: 0 } }), // 29
            Valid.type(new Task(1, function(){}), "task"), // 30
            Valid.type(null, "null"),               // 31
            Valid.type(undefined, "undefined"),     // 32
        ];

    if (/false/.test(rv.join())) {
        next && next.miss();
    } else {
        next && next.pass();
    }
}
 */

})((this || 0).self || global);

