import types from './types'

function traverseAndMark(obj, entries, path) {
    const type = typeof obj
    if (type === 'object') {
        if (obj instanceof Array) {
            return obj.map((e, i) => traverseAndMark(
                e,
                entries,
                [...path, i],
            ))
        }
        else if (obj instanceof Date) {
            entries.push({ path, type: types.DATE })
            return obj.getTime()
        }
        else if (obj instanceof RegExp) {
            entries.push({ path, type: types.REG_EXP })
            return obj.toString()
        }
        else if (obj === null) {
            return obj
        }
        const ret = {}
        Object.getOwnPropertyNames(obj).forEach((key) => {
            const descriptor = Object.getOwnPropertyDescriptor(obj, key)
            if (descriptor.get || descriptor.set) {
                if (descriptor.get) {
                    ret[key] = types.GETTER
                    entries.push({
                        path: [...path, key],
                        type: types.GETTER,
                        value: `(${descriptor.get.toString()})`,
                    })
                }
                if (descriptor.set) {
                    ret[key] = types.SETTER
                    entries.push({
                        path: [...path, key],
                        type: types.SETTER,
                        value: `(${descriptor.set.toString()})`,
                    })
                }
            }
            else {
                ret[key] = traverseAndMark(
                    obj[key],
                    entries,
                    [...path, key],
                )
            }
        })
        return ret
    }
    else if (type === 'function') {
        entries.push({ path, type: types.FUNCTION })
        return `(${obj.toString()})`
    }
    else if (type === 'undefined') {
        entries.push({ path, type: types.UNDEFINED })
        return types.UNDEFINED
    }
    return obj
}

export function stringify(obj) {
    const entries = []
    const recoverableData = traverseAndMark(obj, entries, [], 0)
    return JSON.stringify({ entries, recoverableData })
}
