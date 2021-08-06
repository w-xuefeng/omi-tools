import type { IOmiContext } from './omiContext'
export default function useContext<T>(context: IOmiContext<T>) {
  // @ts-ignore
  return context.useContext().state
}
