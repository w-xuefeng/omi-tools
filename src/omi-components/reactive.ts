import { WeElement, Component } from 'omi'

export type ComponentOrElement = WeElement | Component

const loopObject = <ReactiveData extends Record<string, any>>(
  json: ReactiveData,
  fn: (key: keyof ReactiveData, value: any) => void
) => {
  for (const k in json) {
    if (json.hasOwnProperty(k)) {
      fn(k, json[k])
    }
  }
  return json
}

const bindFns = <ReactiveData extends Record<string, any>>(json: ReactiveData) => {
  return loopObject(json, (k, fn) => {
    if (fn instanceof Function) json[k] = fn.bind(json)
  })
}

function MakeReactive<ReactiveData = Record<string, any>>(
  listeners: Set<ComponentOrElement>,
  json: ReactiveData
) {
  // @ts-ignore
  listeners.add(this)
  const handler = {
    // @ts-ignore
    get(obj: Record<string, any>, prop: string) {
      const val = obj[prop]
      if (typeof val === 'object' && val !== null && prop !== '__internal_proxy') {
        return (val.__internal_proxy =
          val.__internal_proxy || new Proxy(val, handler))
      } else {
        return val
      }
    },
    set: (obj: Record<string, any>, prop: string, value: any) => {
      if (prop === '__internal_proxy') {
        Object.defineProperty(obj, prop, {
          enumerable: false,
          writable: true
        })
        return true
      } else if (value instanceof Function) {
        obj[prop] = value
        return true
      }
      obj[prop] = value
      // @ts-ignore
      listeners.forEach((e) => e && e.update())
      return true
    }
  }
  return bindFns(new Proxy(json as object, handler))
}

function reactive<ReactiveData = Record<string, any>>(obj: ReactiveData) {
  const listeners = new Set<ComponentOrElement>()
  return function() {
    // @ts-ignore
    return MakeReactive.apply(this, [listeners, obj]) as ReactiveData
  }
}

export default reactive
