import type { IOmiContext } from './omiContext'
export default function useContext<T, P>(context: IOmiContext<T>, thisArg?: Omi.WeElement<P>) {
  // @ts-ignore
  return context.useContext.apply(thisArg || this).value
}
