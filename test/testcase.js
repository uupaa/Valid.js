var ModuleTestValid = (function(global) {

var test = new Test(["Valid"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL || IN_WORKER || IN_NODE) {
    test.add([
        testValidComplexTypes,
        testValidType,
        testValidSome,
        testValidSomeIgnore,
        testValidKeys,
        testValidKeys2,
        testValidValues,
        testValidJSON,
        testValidTypedArray,
      //testValidTypeLowerCase,
        testValidRegisterType,
        testValidIsRegisterType,
        testValidFoo,
        testValidArgs,
    ]);
}

// --- test cases ------------------------------------------
function testValidComplexTypes(test, pass, miss) {

    var items = {
            0: Valid.type({}, "SubjectObject|omit"),
            1: Valid.type(null, "NullObject|omit"),
            2: Valid.type(undefined, "UndefinedObject|omit"),
            3: Valid.type(123, "HeyNumber"),
            4: Valid.type(/a/, "HogeRegExp"),
            5: Valid.type([], "StringArray"),
            6: Valid.type([], "IntegerArray/JSONObject"),
            7: Valid.type(new Task("testValidComplexTypes", 1, function(){}), "HogeTask"),
            8: Valid.type("123", "IDString"),
            9: Valid.type("123", "ObjectIDString"),
           10: Valid.type("123", "FooIntegerIDString"),
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidType(test, pass, miss) {
    function Aaa() {}

    var aaa = new Aaa();

    var items = {
            1:  Valid.type({}, "Object|omit"),
            2:  Valid.type(null, "Object|omit"),
            3:  Valid.type(undefined, "Object|omit"),
            4:  Valid.type(123, "Number"),
            5:  Valid.type(123.4, "Number"),
            6:  Valid.type(-123, "Number"),
            7:  Valid.type(-123.4, "Number"),
            8:  Valid.type(123, "Integer"),
            9: !Valid.type(123.4, "Integer"),
           10:  Valid.type(-123, "Integer"),
           11: !Valid.type(-123.4, "Integer"),
           12:  Valid.type("", "String"),
           13:  Valid.type("a", "String"),
           14: !Valid.type(123, "String"),
           15:  Valid.type(/a/, "RegExp"),
           16: !Valid.type("", "RegExp"),
           17:  Valid.type([], "Array"),
           18:  Valid.type([], "Array/Object"),
           19:  Valid.type([], "Object|Array"),
           20:  Valid.type([], "Object|Array|omit"),
           21:  Valid.type(false, "Boolean"),
           22:  Valid.type(true, "Boolean"),
           23: !Valid.type(0, "Boolean"),
           24: !Valid.type("", "Boolean"),
           25: !Valid.type(null, "Boolean"),
           26: !Valid.type(undefined, "Boolean"),
           27:  Valid.type(new Task("testValidType", 1, function(){}), "Task"),
           28:  Valid.type(null, "null"),
           29:  Valid.type(undefined, "undefined"),
           30:  Valid.type(void 0, "void"),
           31:  Valid.type(void 0, "Void"),
           32:  Valid.type(void 0, "Undefined"),
           33:  Valid.type(aaa, "this"),

           34:  Valid.type(-0x80000000, "Int32"),
           35:  Valid.type( 0x7fffffff, "Int32"),
           36: !Valid.type( 0x80000000, "Int32"),
           37:  Valid.type(-0x8000, "Int16"),
           38:  Valid.type( 0x7fff, "Int16"),
           39: !Valid.type( 0x8000, "Int16"),
           40:  Valid.type(-0x80, "Int8"),
           41:  Valid.type( 0x7f, "Int8"),
           42: !Valid.type( 0x80, "Int8"),

           43:  Valid.type(0x0,            "Uint32"),
           44:  Valid.type(0xffffffff,     "Uint32"),
           45: !Valid.type(0xffffffff + 1, "Uint32"),
           46:  Valid.type(0x0,        "Uint16"),
           47:  Valid.type(0xffff,     "Uint16"),
           48: !Valid.type(0xffff + 1, "Uint16"),
           49:  Valid.type(0x0,      "Uint8"),
           50:  Valid.type(0xff,     "Uint8"),
           51: !Valid.type(0xff + 1, "Uint8"),

           52:  Valid.type(0x00000000,     "AARRGGBB"),
           53:  Valid.type(0xffffffff,     "AARRGGBB"),
           54: !Valid.type(0xffffffff + 1, "AARRGGBB"),
           55:  Valid.type(0x00000000,     "RRGGBBAA"),
           56:  Valid.type(0xffffffff,     "RRGGBBAA"),
           57: !Valid.type(0xffffffff + 1, "RRGGBBAA"),
           58:  Valid.type(0x000000,       "RRGGBB"),
           59:  Valid.type(0xffffff,       "RRGGBB"),
           60: !Valid.type(0xffffff + 1,   "RRGGBB"),

           60:  Valid.type(-0x80000000, "INT32"),
           61:  Valid.type( 0x7fffffff, "INT32"),
           62: !Valid.type( 0x80000000, "INT32"),
           63:  Valid.type(-0x8000, "INT16"),
           64:  Valid.type( 0x7fff, "INT16"),
           65: !Valid.type( 0x8000, "INT16"),
           66:  Valid.type(-0x80, "INT8"),
           67:  Valid.type( 0x7f, "INT8"),
           68: !Valid.type( 0x80, "INT8"),

           69:  Valid.type(0x0,            "UINT32"),
           70:  Valid.type(0xffffffff,     "UINT32"),
           71: !Valid.type(0xffffffff + 1, "UINT32"),
           72:  Valid.type(0x0,        "UINT16"),
           73:  Valid.type(0xffff,     "UINT16"),
           74: !Valid.type(0xffff + 1, "UINT16"),
           75:  Valid.type(0x0,      "UINT8"),
           76:  Valid.type(0xff,     "UINT8"),
           77: !Valid.type(0xff + 1, "UINT8"),
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidSome(test, pass, miss) {

    var items = {
            1: Valid.some("a", "a|b|c"),
            2: Valid.some("a", { a:1,b:2,c:3 }),
            3: !Valid.some("z", "a,b,c"),
            4: !Valid.some("z", { a:1,b:2,c:3 }),
            5: Valid.some(null, { a:1,b:2,c:3 }),
            6: Valid.some(undefined, { a:1,b:2,c:3 }),
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidSomeIgnore(test, pass, miss) {

    var items = {
            1: Valid.some("a", "A|b|C", true),
            2: Valid.some("A", { a:1,b:2,c:3 }, true),
            3: !Valid.some("Z", "a,b,c", true),
            4: !Valid.some("Z", { a:1,b:2,c:3 }, true)
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidKeys(test, pass, miss) {

    var rv = [
            Valid.keys({}, "key1/key2/key3"),
           !Valid.keys({ hey: 1 }, "key1|key2|key3"),
            Valid.keys({ key1: 1, key2: 2 }, "key1,key2"),
           !Valid.keys({ key1: 1, key2: 2, key3: 3 }, "key1,key2"),
        ];

    if (/false/.test(rv.join())) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testValidKeys2(test, pass, miss) {

    var object = { "foo": 1, "bar": 2, "buz": 3, };
    var array  = [ 1, 2 ]; // { 0: 1, 1: 2, length: 2 }

    var rv = [
            !Valid.keys(object,    "foo|bar"),         // -> false (foo or bar を想定しているが、object に想定外の buz が存在する → false)
             Valid.keys(object,    "foo|bar|buz|pee"), // -> true  (foo or bar or buz or pee を想定しており、 object に foo, bar, buz が含まれる → true)
             Valid.keys(array,     "0|1"),             // -> true  (0 or 1 を想定しており、array に 0, 1 が含まれる → true)
            !Valid.keys(array,     "0|2"),             // -> false (0 or 1 を想定しており、array に想定外の 2 が含まれる → false)
             Valid.keys(null,      ""),                // -> true
             Valid.keys(undefined, ""),                // -> true
        ];

    if (/false/.test(rv.join())) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}

function testValidValues(test, pass, miss) {

    var object = { "foo": 1, "bar": 2, "buz": 3, };
    var array  = [ 1, 2 ]; // { 0: 1, 1: 2, length: 2 }

    var rv = [
            !Valid.values(object,    [1,2]),          // -> false (1 or 2 を想定しているが、object に想定外の 3 が存在する → false)
             Valid.values(object,    [1,2,3,4]),      // -> true  (1 or 2 or 3 or 4 を想定しており、object に 1, 2, 3 が含まれる → true)
             Valid.values(array,     [1,2]),          // -> true  (1 or 2 を想定しており、array に 1, 2 が含まれる → true)
            !Valid.values(array,     [1,3]),          // -> false (1 or 3 を想定しており、array に想定外の 2 が含まれる → false)
             Valid.values(null,      ""),             // -> true
             Valid.values(undefined, ""),             // -> true
        ];

    if (/false/.test(rv.join())) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}


function testValidJSON(test, pass, miss) {
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
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidTypedArray(test, pass, miss) {

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
            12: !Valid.type([0x7f, 0xfff], "Int8Array"),
        };

    var ok = Object.keys(items).every(function(num) {
                return items[num];
            });

    if (ok) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

/*
function testValidTypeLowerCase(test, pass, miss) {

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
            Valid.type(new Task("testValidTypeLowerCase", 1, function(){}), "task"), // 30
            Valid.type(null, "null"),               // 31
            Valid.type(undefined, "undefined"),     // 32
        ];

    if (/false/.test(rv.join())) {
        test.done(miss());
    } else {
        test.done(pass());
    }
}
 */

function testValidRegisterType(test, pass, miss) {
    Valid.register("FooString", function(type, value) {
        return /^Foo/.test(value);
    });

    var rv1 = Valid.type("FooString", "FooString");
    var rv2 = Valid.type("FooString", "String|omit");

    if (rv1 && rv2) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidIsRegisterType(test, pass, miss) {
    if ( !Valid.isRegistered("BarString") ) {
        Valid.register("BarString", function(type, value) {
            return /^Bar/.test(value);
        });
    }
    var rv = Valid.isRegistered("BarString");

    if (rv) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testValidFoo(test, pass, miss) {

    try {
        foo(new Uint32Array([1,2,3]), "b", "B", { foo: 1, bar: 2 },
            { verbose: true, cursor: 0, color: 0xffffff });
        test.done(miss());
    } catch(o_o) {
        test.done(pass());
    }
}

function testValidArgs(test, pass, miss) {

    function buzz(arg1,   // @arg Number|String
                  arg2) { // @arg String = ""
//{@dev
        Valid.args(buzz, arguments);
//}@dev
    }

    try {
        buzz(123, []);
        test.done(miss());
    } catch(o_o) {
        test.done(pass());
    }
}

function foo(buffer,              // @arg Uint32Array
             keyword,             // @arg String - "a" or "b" or "c"
             keyword2,   // @arg IgnoreCaseString - "a" or "b" or "c"
             options) {           // @arg Object - { verbose, cursor }
//{@dev
    $valid($type(buffer,   "Uint32Array"),   foo, "buffer");   // -> ok
    $valid($some(keyword,  "a|b|c"),         foo, "keyword");  // -> ok
    $valid($some(keyword2, "a|b|c", true),   foo, "keyword2"); // -> ok
    $valid($keys(options,  "verbose|cursor"),foo, "options");  // -> color is unknown property -> throw
//}@dev
}

/*
// ソリッドなコード
function foo(param,      // @arg Object - { type, target }
                         // @param.type String - "DOM" or "SVG" or "CSS"
                         // @param.target String = ""
             callback) { // @arg Function = null - callback(param.type:String, param.target:String = ""):void
//{@dev
    // [1] param が Object型 な事を確認しています
    // [2] Object.keys(param) に含まれる key が "type" と "target" で、それ以外の不純物がない事を確認しています
    // [3] param.type が String型 で、 内容が "DOM", "SVG", "CSS" の何れかである事を確認しています
    // [4] param.target が String型 で省略可能な事をチェックしています
    // [5] callback が Function型で省略可能な事をチェックしています

    $valid($type(param, "Object"), foo, "param"); // [1]
    $valid($keys(param, "type|target"), foo, "param"); // [2]
    $valid($type(param.type, "String") && $some(param.type, "DOM|SVG|CSS"), foo, "param.type"); // [3]
    $valid($type(param.target, "String|omit"), foo, "param.target"); // [4]
    $valid($type(callback, "Function|omit"), foo, "callback"); // [5]
//}@dev

    bar(param, callback);
}

function bar(param, callback) {
    if (callback) {
        callback(param.type, param.target);
    }
}
 */

return test.run();

})(GLOBAL);

