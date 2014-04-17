=========
Valid.js
=========

![](https://travis-ci.org/uupaa/Valid.js.png)

Validate functions.

# Document

- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [Valid.js wiki](https://github.com/uupaa/Valid.js/wiki/Valid)


# How to use

```js
<script src="lib/Valid.js">
<script>
// for Browser
console.log( Valid.stack("CallStack") );
</script>
```

```js
// for WebWorkers
importScripts("lib/Valid.js");
console.log( Valid.stack("CallStack") );
```

```js
// for Node.js
var Valid = require("lib/Valid.js");
console.log( Valid.stack("CallStack") );
```
