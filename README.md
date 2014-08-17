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
console.log( Valid.stack("CallStack") );
</script>
```

### WebWorkers

```js
importScripts("lib/Valid.js");
console.log( Valid.stack("CallStack") );
```

### Node.js

```js
var Valid = require("lib/Valid.js");
console.log( Valid.stack("CallStack") );
```

