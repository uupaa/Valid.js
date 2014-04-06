Valid.js
=========

Validate functions.

# Document

- https://github.com/uupaa/Valid.js/wiki/Valid

and

- https://github.com/uupaa/WebModule and [slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
- https://github.com/uupaa/Help.js and [slide](http://uupaa.github.io/Slide/slide/Help.js/index.html)

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

# for Developers

1. Install development dependency tools

    ```sh
    $ brew install closure-compiler
    $ brew install node
    $ npm install -g plato
    ```

2. Clone Repository and Install

    ```sh
    $ git clone git@github.com:uupaa/Valid.js.git
    $ cd Valid.js
    $ npm install
    ```

3. Build and Minify

    `$ npm run build`

4. Test

    `$ npm run test`

5. Lint

    `$ npm run lint`


