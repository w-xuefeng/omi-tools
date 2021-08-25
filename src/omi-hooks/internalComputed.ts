import { WeElement } from 'omi'

interface IMemoComputed {
  data: any,
  dependencies: any[],
  context: WeElement
}
interface IMemoContextComputed {
  globalMemoryComputed: Map<string, IMemoComputed>
  globalWeakMemoryComputed: WeakMap<Function, IMemoComputed>
}
type OmiHooks = 'useEffect' | 'useMemo' | 'useCallback'
const globalContextMemoryComputed = new WeakMap<WeElement, IMemoContextComputed>()

export default function internalComputed<T>(
  hooksName: OmiHooks,
  callback: () => T,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean,
  handleEffectOptions?: {
    enable?: boolean,
    handleBefore?: Function,
    handleAfter?: Function
  }
) {
  // @ts-ignore
  const context = this instanceof WeElement ? this : undefined
  if (!context) {
    return console.error(`[Omi-Hooks Error] You need to provide a context for ${hooksName}, such as ${hooksName}.apply(context, args)`)
  }

  const defaultMemoryComputed = {
    globalMemoryComputed: new Map<string, IMemoComputed>(),
    globalWeakMemoryComputed: new WeakMap<Function, IMemoComputed>()
  }

  const {
    globalMemoryComputed,
    globalWeakMemoryComputed
  } = globalContextMemoryComputed.get(context) || defaultMemoryComputed

  const key = `${context.tagName}-${hooksName}-${callback.toString()}`

  const updateComputedResult = () => {
    handleEffectOptions &&
      handleEffectOptions.enable &&
      typeof handleEffectOptions.handleBefore === 'function' &&
      handleEffectOptions.handleBefore()

    const nextData = callback()

    handleEffectOptions &&
      handleEffectOptions.enable &&
      typeof handleEffectOptions.handleAfter === 'function' &&
      handleEffectOptions.handleAfter()

    globalMemoryComputed.set(key, { data: nextData, dependencies: deps, context })
    globalWeakMemoryComputed.set(callback, { data: nextData, dependencies: deps, context })
    globalContextMemoryComputed.set(context, { globalMemoryComputed, globalWeakMemoryComputed })
    return nextData
  }

  if (globalWeakMemoryComputed.has(callback)) {
    const { data: prevData, dependencies: prevDeps = [], context: prevContext = {} } = globalWeakMemoryComputed.get(callback) || {}
    const isForceUpdate = Boolean(shouldUpdate && typeof shouldUpdate === 'function' && shouldUpdate(prevDeps, deps))
    if (isForceUpdate) return updateComputedResult()
    if (
      prevContext === context &&
      prevDeps.length === deps.length &&
      prevDeps.every((dep: any, i: number) => dep === deps[i])
    ) {
      return prevData
    }
  }

  if (globalMemoryComputed.has(key)) {
    const { data: prevData, dependencies: prevDeps = [], context: prevContext = {} } = globalMemoryComputed.get(key) || {}
    const isForceUpdate = Boolean(shouldUpdate && typeof shouldUpdate === 'function' && shouldUpdate(prevDeps, deps))
    if (isForceUpdate) return updateComputedResult()
    if (
      prevContext === context &&
      prevDeps.length === deps.length &&
      prevDeps.every((dep: any, i: number) => dep === deps[i])
    ) {
      return prevData
    }
  }

  return updateComputedResult()
}
