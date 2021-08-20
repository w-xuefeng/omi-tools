import { useMemo } from '.'

export default function useCallback(
  callback: () => any,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean
) {
  return useMemo(() => callback, deps, shouldUpdate)
}
