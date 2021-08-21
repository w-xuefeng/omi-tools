import { WeElement } from 'omi'
import internalComputed from './internalComputed'

export default function useCallback(
  callback: () => any,
  deps: any[],
  shouldUpdate?: (prevDeps: any[], nextDeps: any) => boolean,
  ctx?: WeElement
) {
  // @ts-ignore
  return internalComputed.apply(ctx || this, ['useCallback', () => callback, deps, shouldUpdate])
}
