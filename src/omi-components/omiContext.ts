import { define, WeElement } from 'omi'
import reactive from './reactive'

let CPCount = 0

export interface ProviderProps<T> {
  value: T,
  setValue(value: T): void
}

export interface ConsumerProps { }

export interface IStore<T> extends Record<string, any> {
  context: T
}

export interface Provider<T> extends Omi.WeElement<ProviderProps<T>> { }

export interface Consumer extends Omi.WeElement { }

export interface ProviderConstructor<T> {
  new(): Provider<T>
}

export interface ConsumerConstructor {
  new(): Consumer
}

export interface IOmiContext<T> {
  Provider: ProviderConstructor<T>
  Consumer: ConsumerConstructor
  useContext: () => ProviderProps<T>
}

export default function createContext<T>(defaultValue: T): IOmiContext<T> {
  CPCount++
  const useContext = reactive<ProviderProps<T>>({
    value: defaultValue,
    setValue(value: T) {
      this.value = value
    }
  })
  return {
    Provider: (() => {
      class Provider extends WeElement<ProviderProps<T>> {
        render(props: Omi.RenderableProps<ProviderProps<T>>, store: IStore<ProviderProps<T>>) {
          const context = useContext.apply(this) as ProviderProps<T>
          context.setValue(props.value || context.value)
          store.context = context
          return props.children
        }
      }
      define(`o-provider-${CPCount}`, Provider)
      return Provider
    })(),
    Consumer: (() => {
      class Consumer extends WeElement<ConsumerProps> {
        render(props: Omi.RenderableProps<ConsumerProps>, store: IStore<ProviderProps<T>>) {
          const { children } = props
          return Array.isArray(children) && typeof children[0] === 'function'
            ? children[0](store.context)
            : children
        }
      }
      define(`o-consumer-${CPCount}`, Consumer)
      return Consumer
    })(),
    useContext
  }
}
