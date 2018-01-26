# json-enhance

[![npm Version](https://img.shields.io/npm/v/json-enhance.svg)](https://www.npmjs.com/package/json-enhance) [![License](https://img.shields.io/npm/l/json-enhance.svg)](https://www.npmjs.com/package/json-enhance) [![Build Status](https://travis-ci.org/swenyang/json-ext.svg?branch=master)](https://travis-ci.org/swenyang/json-ext) [![Coverage Status](https://coveralls.io/repos/github/swenyang/json-ext/badge.svg?branch=master)](https://coveralls.io/github/swenyang/json-ext?branch=master)

Extend JSON.stringify() & JSON.parse() to handle more values:

- Date
- `undefined`
- Function
- RegExp
- Getter
- Setter

And both `stringify()` and `parse()` are safe:

- **No modification** on original data.
- **No special markup** on special values. Auxiliary data structure is used to mark special values.

    For example, if we mark Date instance with prefix `__DATE__`, it may conflicts with real values in some cases.
    
- **Identical** before `stringify()` and after `parse()`.

## How to use

```bash
npm i --save json-enhance
```

```js
import { stringify, parse } from 'json-enhance'

const obj = {
    a: 1,
    b: true,
    c: [
        '123',
        new Date(2018, 0, 1),
        { x: '123' },
        (a, b) => a - b,
    ],
    d: undefined,
    e: /\/(.*?)\/([gimy])?$/,
    f: (a, b) => a + b,
}
Object.defineProperty(obj, 'x', {
    get() {
        return this.mX
    },
    set(v) {
        this.mX = v
    },
})
const str = stringify(obj)
parse(str) // equals obj
```

## Pitfalls

### `toString()`

Functions, RegExp, Getter, Setter are compared by calling `toString()` and then direct string matching.

### Closure

If functions access variables in the upper closure, calling them after `parse()` may cause error. **Keep your functions pure**.

### Getter/Setter

There are several ways to write getter/setter, however, one of them is unapplicable to `parse()`:

✅

```js
Object.defineProperty(obj, 'x', {
    get() {
        return this.mX
    },
    set(v) {
        this.mX = v
    },
})
```

✅

```js
obj.__defineGetter__('x', function () {
    return this.mX
})
obj.__defineSetter__('x', function (v) {
    this.mX = v
})
```

❌

```js
const obj = {
    get x() {
        return this.mX
    }
    set x(v) {
        this.mX = v
    }
}
```

