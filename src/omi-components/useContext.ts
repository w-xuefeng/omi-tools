import type { IOmiContext } from './omiContext'
export default function useContext<T>(context: IOmiContext<T>) {
  return context.useContext().state
}
