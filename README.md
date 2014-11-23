# Valid.js [![Build Status](https://travis-ci.org/uupaa/Valid.js.png)](http://travis-ci.org/uupaa/Valid.js)

[![npm](https://nodei.co/npm/uupaa.valid.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.valid.js/)

Validate functions.

## Document

- [Valid.js wiki](https://github.com/uupaa/Valid.js/wiki/Valid)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)


## How to use

### Browser

```js
<script src="lib/Valid.js"></script>
<script>


// --- implements ------------------------------------------
function foo(buffer,    // @arg Uint32Array
             keyword,   // @arg String - "a" or "b" or "c"
             keyword2,  // @arg IgnoreCaseString - "a" or "b" or "c"
             options) { // @arg Object - { verbose, cursor }

// validate the foo arguments.
//{@dev
    $valid($type(buffer,   "Uint32Array"),   foo, "buffer");   // -> ok
    $valid($some(keyword,  "a|b|c"),         foo, "keyword");  // -> ok
    $valid($some(keyword2, "a|b|c", true),   foo, "keyword2"); // -> ok
    $valid($keys(options,  "verbose|cursor"),foo, "options");  // -> color is unknown property -> throw
//}@dev
}

// call foo with arguments.
foo(new Uint32Array([1,2,3]), "b", "B", { foo: 1, bar: 2 },
    { verbose: true, cursor: 0, color: 0xffffff });

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

</script>
```

### WebWorkers

```js
importScripts("lib/Valid.js");

...
```

### Node.js

```js
var Valid = require("lib/Valid.js");

...
```

