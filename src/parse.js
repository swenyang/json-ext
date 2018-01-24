import types from './types'

function matchPath(pathA, pathB) {
    return pathA.length === pathB.length
        && pathA.every((p, i) => p === pathB[i])
}

function recover(obj, entries, path) {
    const match = entries.find(entry => matchPath(entry.path, path))
    if (match) {
        switch (match.type) {
            case types.DATE:
                return new Date(obj)
            case types.UNDEFINED:
                return undefined
            case types.REG_EXP: {
                const fragments = obj.match(/\/(.*?)\/([gimy])?$/)
                return new RegExp(fragments[1], fragments[2] || '')
            }
            case types.FUNCTION:
                // eslint-disable-next-line
                return eval(obj)
            default:
                break
        }
    }

    if (typeof obj === 'object') {
        if (obj instanceof Array) {
            return obj.map((e, i) => recover(
                e,
                entries,
                [...path, i],
            ))
        }
        else if (obj === null) {
            return obj
        }
        const ret = {}
        Object.keys(obj).forEach((key) => {
            const nextPath = [...path, key]
            const preMatch = entries
                .filter(entry => matchPath(entry.path, nextPath))
            const getter = preMatch.find(e => e.type === types.GETTER)
            const setter = preMatch.find(e => e.type === types.SETTER)
            if (getter || setter) {
                if (getter) {
                    // eslint-disable-next-line
                    ret.__defineGetter__(key, eval(getter.value))
                }
                if (setter) {
                    // eslint-disable-next-line
                    ret.__defineSetter__(key, eval(setter.value))
                }
            }
            else {
                ret[key] = recover(
                    obj[key],
                    entries,
                    [...path, key],
                )
            }
        })
        return ret
    }
    return obj
}

export function parse(str) {
    try {
        const o = JSON.parse(str)
        if (o.entries instanceof Array
            && o.entries.every(e => e.path && e.type)) {
            return recover(o.recoverableData, o.entries, [])
        }
        return null
    }
    catch (e) {
        console.error(e)
        return null
    }
}

