interface IMemoComputed {
  data: any,
  dependencies: any[]
}
const globalMemoryComputed = new Map<string, IMemoComputed>()

export default function useMemo<T>(callback: () => T, deps: any[]) {
  const key = callback.toString()
  if (globalMemoryComputed.has(key)) {
    const { data: prevData, dependencies: prevDeps = [] } = globalMemoryComputed.get(key) || {}
    if (
      prevDeps.length === deps.length
      && prevDeps.every((dep: any, i: number) => dep === deps[i])
    ) {
      return prevData
    }
  }
  const nextData = callback()
  globalMemoryComputed.set(key, { data: nextData, dependencies: deps })
  return nextData
}
