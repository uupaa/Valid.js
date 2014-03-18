new Test().add([
        testValidType,
        testValidKeys,
        testValidJSON,
    ]).run(function(err, test) {
        if (1) {
            err || test.worker(function(err, test) {
                if (!err && typeof Valid_ !== "undefined") {
                    var name = Test.swap(Valid, Valid_);

                    new Test(test).run(function(err, test) {
                        Test.undo(name);
                    });
                }
            });
        }
    });

function testValidType(next) {

    var rv = [
            Valid.type({}, "Object/omit"),          // 0
            Valid.type(null, "Object/omit"),        // 1
            Valid.type(undefined, "Object/omit"),   // 2
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
            Valid.type([], "Object/Array"),         // 18
            Valid.type([], "Object/Array/omit"),    // 19
            Valid.type(false, "Boolean"),           // 20
            Valid.type(true, "Boolean"),            // 21
           !Valid.type(0, "Boolean"),               // 22
           !Valid.type("", "Boolean"),              // 23
           !Valid.type(null, "Boolean"),            // 24
           !Valid.type(undefined, "Boolean"),       // 25
            Valid.type({ a: 1, b: 2 }, "Object/omit", "a,b"), // 26
            Valid.type({ a: 1, b: 2, c: 0 }, "JSON/omit", { a: 0, b: 0, c: 0 }), // 27
           !Valid.type({ a: 1, b: 2, c: {} }, "JSON/omit", { a: 0, b: 0, c: 0 }), // 28
            Valid.type({ a: 1, b: 2, c: { d: 1 } }, "JSON/omit", { a: 0, b: 0, c: { d: 0 } }), // 29
            Valid.type(new Task(1, function(){}), "Task"), // 30
            Valid.type(null, "null"),               // 31
            Valid.type(undefined, "undefined"),     // 32
        ];

    if (/false/.test(rv.join())) {
        console.log("testValidType ng");
        next && next.miss();
    } else {
        console.log("testValidType ok");
        next && next.pass();
    }
}

function testValidKeys(next) {

    var rv = [
            Valid.keys({}, "key1,key2,key3"),
           !Valid.keys({ hey: 1 }, "key1,key2,key3"),
            Valid.keys({ key1: 1, key2: 2 }, "key1,key2"),
           !Valid.keys({ key1: 1, key2: 2, key3: 3 }, "key1,key2"),
        ];

    if (/false/.test(rv.join())) {
        console.log("testValidKeys ng");
        next && next.miss();
    } else {
        console.log("testValidKeys ok");
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
        console.log("testValidJSON ok");
        next && next.pass();
    } else {
        console.log("testValidJSON ng");
        next && next.miss();
    }
}

