import { WeElement } from 'omi'
import { useMemo } from '.'

export default function useEffect(callback: () => Function | undefined, deps?: any[], ctx?: WeElement) {
  // @ts-ignore
  const context: WeElement | undefined = (this instanceof WeElement ? this : ctx instanceof WeElement ? ctx : undefined)

  if (!context) {
    return console.error('[Omi-Hooks Error] useEffect can only be used inside OmiComponents or WeElement. If you use it elsewhere or use arrow functions, you need to provide a context for it. You can choose one of the following three:\n\t1. useEffect(callback, dependencies, context);\n\t2. useEffect.apply(context, [callback, dependencies]);\n\t3. useEffect.call(context, callback, dependencies);')
  }

  /**
   * Backup omi update function
   */
  const omiUpdate = context.update
  /**
   * Empty omi update function
   */
  context.update = (ignoreAttrs?: boolean | undefined, updateSelf?: boolean | undefined) => { }
  /**
   * The function returned by callback will be injected into the lifecycle uninstall
   */
  let useEffectReturnUninstall: Function | undefined = () => { }

  /**
   * `this.update` can't and shouldn't be used to update omi components or pages in callback,
   * otherwise it will cause infinite loop rendering of pages or components
   */
  if (deps && Array.isArray(deps)) {
    useEffectReturnUninstall = useMemo(callback, deps)
  } else {
    useEffectReturnUninstall = callback()
  }

  /**
   * Recover omi update function
   */
  context.update = omiUpdate

  /**
   * Inject the function returned by callback into the uninstall lifecycle
   */
  useMemo(() => {
    const originUnintall = context.uninstall
    context.uninstall = function() {
      typeof originUnintall === 'function' && originUnintall.apply(this)
      typeof useEffectReturnUninstall === 'function' && useEffectReturnUninstall.apply(this)
    }
  }, [useEffectReturnUninstall])
}
