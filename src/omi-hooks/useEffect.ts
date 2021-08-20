import { WeElement } from 'omi'
import { internalUseMemo } from './useMemo'

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
  const handleBefore = () => {
    context.update = (ignoreAttrs?: boolean | undefined, updateSelf?: boolean | undefined) => { }
  }

  /**
  * Recover omi update function
  */
  const handleAfter = () => {
    context.update = omiUpdate
  }

  /**
   * The function returned by callback will be injected into the lifecycle uninstall
   */
  let useEffectReturnUninstall: Function | undefined = () => { }

  /**
   * `this.update` can't and shouldn't be used to update omi components or pages in callback,
   * otherwise it will cause infinite loop rendering of pages or components
   */
  if (deps && Array.isArray(deps)) {
    useEffectReturnUninstall = internalUseMemo(
      callback,
      deps,
      undefined,
      {
        enable: true,
        handleBefore,
        handleAfter
      }
    )
  } else {
    handleBefore()
    useEffectReturnUninstall = callback()
    handleAfter()
  }

  /**
   * Inject the function returned by callback into the uninstall lifecycle
   */
  internalUseMemo(() => {
    const originUnintall = context.uninstall
    context.uninstall = function() {
      typeof originUnintall === 'function' && originUnintall.apply(this)
      typeof useEffectReturnUninstall === 'function' && useEffectReturnUninstall.apply(this)
    }
  }, [useEffectReturnUninstall])
}
