interface IMemoComputed {
  data: any,
  dependencies: any[]
}
const globalMemoryComputed = new Map<string, IMemoComputed>()
const globalWeakMemoryComputed = new WeakMap<Function, IMemoComputed>()

export function internalUseMemo<T>(
  callback: () => T,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean,
  handleEffectOptions?: {
    enable?: boolean,
    handleBefore?: Function,
    handleAfter?: Function
  }
) {
  const key = callback.toString()

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

    globalMemoryComputed.set(key, { data: nextData, dependencies: deps })
    globalWeakMemoryComputed.set(callback, { data: nextData, dependencies: deps })
    return nextData
  }

  if (globalWeakMemoryComputed.has(callback)) {
    const { data: prevData, dependencies: prevDeps = [] } = globalWeakMemoryComputed.get(callback) || {}
    const isForceUpdate = Boolean(shouldUpdate && typeof shouldUpdate === 'function' && shouldUpdate(prevDeps, deps))
    if (isForceUpdate) return updateComputedResult()
    if (
      prevDeps.length === deps.length &&
      prevDeps.every((dep: any, i: number) => dep === deps[i])
    ) {
      return prevData
    }
  }

  if (globalMemoryComputed.has(key)) {
    const { data: prevData, dependencies: prevDeps = [] } = globalMemoryComputed.get(key) || {}
    const isForceUpdate = Boolean(shouldUpdate && typeof shouldUpdate === 'function' && shouldUpdate(prevDeps, deps))
    if (isForceUpdate) return updateComputedResult()
    if (
      prevDeps.length === deps.length &&
      prevDeps.every((dep: any, i: number) => dep === deps[i])
    ) {
      return prevData
    }
  }

  return updateComputedResult()
}

export default function useMemo<T>(
  callback: () => T,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean
) {
  return internalUseMemo(callback, deps, shouldUpdate)
}
