import { WeElement } from 'omi'
import { useMemo } from '.'

export default function useEffect(callback: () => Function | undefined, deps?: any[], ctx?: WeElement) {
  let useEffectReturnUninstall: Function | undefined = () => { }
  if (deps && Array.isArray(deps)) {
    useEffectReturnUninstall = useMemo(callback, deps)
  } else {
    useEffectReturnUninstall = callback()
  }
  // @ts-ignore
  const context: WeElement | undefined = (this instanceof WeElement ? this : ctx instanceof WeElement ? ctx : undefined)
  if (context) {
    useMemo(() => {
      const originUnintall = context.uninstall
      context.uninstall = function() {
        typeof originUnintall === 'function' && originUnintall.apply(this)
        typeof useEffectReturnUninstall === 'function' && useEffectReturnUninstall.apply(this)
      }
    }, [])
  } else {
    console.error('[Omi-Hooks Error] useEffect can only be used inside OmiComponents or WeElement. If you use it elsewhere or use arrow functions, you need to provide a context for it. You can choose one of the following three:\n\t1. useEffect(callback, dependencies, context);\n\t2. useEffect.apply(context, [callback, dependencies]);\n\t3. useEffect.call(context, callback, dependencies);')
  }
}
