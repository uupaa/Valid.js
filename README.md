# Valid.js [![Build Status](https://travis-ci.org/uupaa/Valid.js.svg)](https://travis-ci.org/uupaa/Valid.js)

[![npm](https://nodei.co/npm/uupaa.valid.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.valid.js/)

Validate functions.


This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/Valid.js/wiki/)
- [API Spec](https://github.com/uupaa/Valid.js/wiki/Valid)

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/Valid.js"></script>
<script>

function foo(buffer,    // @arg Uint32Array
             keyword,   // @arg String - "a" or "b" or "c"
             keyword2,  // @arg IgnoreCaseString - "a" or "b" or "c"
             options) { // @arg Object - { verbose, cursor }

// validate the foo arguments.
//{@dev
    $valid($type(buffer,     "Uint32Array"),   foo, "buffer");   // -> ok
    $valid($keys(options,    "verbose|cursor"),foo, "options");  // -> color is unknown property -> throw
//}@dev
}

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/Valid.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/Valid.js");

```

