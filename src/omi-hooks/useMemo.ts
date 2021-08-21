import { WeElement } from 'omi'
import internalComputed from './internalComputed'

export default function useMemo<T>(
  callback: () => T,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean,
  ctx?: WeElement
) {
  // @ts-ignore
  return internalComputed.apply(ctx || this, ['useMemo', callback, deps, shouldUpdate])
}
