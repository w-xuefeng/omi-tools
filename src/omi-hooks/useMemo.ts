interface IMemoComputed {
  data: any,
  dependencies: any[]
}
const globalMemoryComputed = new Map<string, IMemoComputed>()
const globalWeakMemoryComputed = new WeakMap<Function, IMemoComputed>()

export default function useMemo<T>(
  callback: () => T,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean
) {
  const key = callback.toString()

  const updateComputedResult = () => {
    const nextData = callback()
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
