import deepEqualExt from 'deep-equal-ext'
import { stringify, parse } from '../src/index'

expect.extend({
    toDeepEqual(received, argument) {
        const pass = deepEqualExt(received, argument)
        if (pass) {
            return {
                message: () => `expected ${received} to be deep equal by ${argument}`,
                pass: true,
            }
        } else {
            return {
                message: () => `expected ${received} to be deep equal by ${argument}`,
                pass: false,
            }
        }
    },
})

describe('json-enhance.js', () => {
    test('primitives', () => {
        expect(parse(stringify(null))).toBe(null)
        expect(parse(stringify(undefined))).toBe(undefined)
        expect(parse(stringify(1))).toBe(1)
        expect(parse(stringify(true))).toBe(true)
        expect(parse(stringify(false))).toBe(false)
        expect(parse(stringify(''))).toBe('')
        expect(parse(stringify('123'))).toBe('123')
    })
    // test('error', () => {
    //     expect(parse(stringify({
    //         mX: 1,
    //         get x() {
    //             return this.mX
    //         },
    //         set x(v) {
    //             this.mX = v
    //         }
    //     }))).toBe(null)
    // })
    test('array without speical values', () => {
        const d1 = [1, 2, 3]
        expect(parse(stringify(d1))).toEqual(d1)
        const d2 = [
            1,
            { x: 1, y: 'b', z: ['a', 'b', 'c'] },
            3,
            'hello world',
            true,
        ]
        expect(parse(stringify(d2))).toEqual(d2)
    })
    test('array with special values', () => {
        const d1 = [
            1,
            {
                x: 1,
                y: 'b',
                z: ['a', 'b', 'c'],
                mD: new Date(2018, 3, 1),
                f: a => window.location.href = a,
            },
            3,
            'hello world',
            new Date(2018, 0, 1),
            () => {},
            [1, 2, 3, () => {}],
            undefined,
            /\/(.*?)\/([gimy])?$/,
            /\d{11}$/g,
        ]
        const str1 = stringify(d1)
        console.log(str1)
        expect(parse(str1)).toDeepEqual(d1)
    })
    test('object without special values', () => {
        expect(parse(stringify({}))).toEqual({})
        const d1 = { x: 1, y: 'abc', z: [1, 2, 3] }
        expect(parse(stringify(d1))).toEqual(d1)
        const d2 = {
            x: {
                xx: {
                    xxx: {
                        value: '11',
                    },
                },
                xx2: {
                    v1: 123,
                    v2: [1, 2, 3],
                    v3: null,
                },
            },
            y: true,
            z: null,
        }
        expect(parse(stringify(d2))).toEqual(d2)
    })
    test('object with special values', () => {
        expect(parse(stringify({ x: undefined }))).toEqual({ x: undefined })
        const obj = {
            t: {
                xx: {
                    xxx: {
                        value: '11',
                        f: (a, b) => a * b,
                        b: false,
                        d: new Date(2018, 5, 1),
                        c: undefined,
                    },
                },
                xx2: {
                    v1: 123,
                    v2: [1, 2, 3],
                    v3: null,
                },
            },
            a: 1,
            b: true,
            c: [
                '123',
                1,
                new Date(2018, 0, 1),
                { x: '123' },
                (a, b) => a - b,
            ],
            d: new Date(2018, 1, 1),
            e: undefined,
            mX: [ 1, 2 ],
            f: (a, b) => a + b,
            reg: /\/(.*?)\/([gimy])?$/,
            reg2: /\d{11}$/g,
        }
        Object.defineProperty(obj, 'y', {
            get() {
                return this.mY
            },
            set(v) {
                this.mY = v
            },
        })
        Object.defineProperty(obj, 'yy', {
            get() {
                return this.mYy
            },
        })
        obj.__defineGetter__('x', function () {
            return this.mX
        })
        obj.__defineSetter__('x', function (v) {
            this.mX = v
        })
        obj.__defineGetter__('zz', function () {
            return this.mZz
        })
        obj.__defineSetter__('z', function (v) {
            this.mZ = v
        })
        expect(parse(stringify(obj))).toDeepEqual(obj)
    })
})

