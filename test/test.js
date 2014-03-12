new Test().add([
        testValidType,
        testValidKeys,
        testValidJSON,
    ]).run().worker(function(err, test) {
        if (!err && typeof Valid_ !== "undefined") {
            var undo = Test.swap(Valid, Valid_);

            new Test(test).run(function(err, test) {
                Test.undo(undo);
            });
        }
    });

function testValidType(next) {

    var rv = [
            Valid.type({}, "Object/omit"),
            Valid.type(null, "Object/omit"),
            Valid.type(undefined, "Object/omit"),
            Valid.type(123, "Number"),
            Valid.type(123.4, "Number"),
            Valid.type(-123, "Number"),
            Valid.type(-123.4, "Number"),
            Valid.type(123, "Integer"),
           !Valid.type(123.4, "Integer"),
            Valid.type(-123, "Integer"),
           !Valid.type(-123.4, "Integer"),
            Valid.type("", "String"),
            Valid.type("a", "String"),
           !Valid.type(123, "String"),
            Valid.type(/a/, "RegExp"),
           !Valid.type("", "RegExp"),
            Valid.type([], "Array"),
            Valid.type([], "Array/Object"),
            Valid.type([], "Object/Array"),
            Valid.type([], "Object/Array/omit"),
            Valid.type(false, "Boolean"),
            Valid.type(true, "Boolean"),
           !Valid.type(0, "Boolean"),
           !Valid.type("", "Boolean"),
           !Valid.type(null, "Boolean"),
           !Valid.type(undefined, "Boolean"),
            Valid.type({ a: 1, b: 2 }, "Object/omit", "a,b"),
            Valid.type({ a: 1, b: 2, c: 0 }, "JSON/omit", { a: 0, b: 0, c: 0 }),
           !Valid.type({ a: 1, b: 2, c: {} }, "JSON/omit", { a: 0, b: 0, c: 0 }),
            Valid.type({ a: 1, b: 2, c: { d: 1 } }, "JSON/omit", { a: 0, b: 0, c: { d: 0 } }),
        ];

    if (!/false/.test(rv.join(","))) {
        console.log("testValidType ok");
        next && next.pass();
    } else {
        console.log("testValidType ng");
        next && next.miss();
    }
}

function testValidKeys(next) {

    var rv = [
            Valid.keys({}, "key1,key2,key3"),
           !Valid.keys({ hey: 1 }, "key1,key2,key3"),
            Valid.keys({ key1: 1, key2: 2 }, "key1,key2"),
           !Valid.keys({ key1: 1, key2: 2, key3: 3 }, "key1,key2"),
        ];

    if (!/false/.test(rv.join(","))) {
        console.log("testValidKeys ok");
        next && next.pass();
    } else {
        console.log("testValidKeys ng");
        next && next.miss();
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

