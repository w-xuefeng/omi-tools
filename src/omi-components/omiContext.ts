import { define, WeElement } from 'omi'
import reactive from './reactive'

let CPCount = 0

interface ProviderProps<T> {
  value?: T
}

interface ConsumerProps { }

interface IStore<T> extends Record<string, any> {
  context: T
}

interface Provider<T> extends Omi.WeElement<ProviderProps<T>> { }

interface Consumer extends Omi.WeElement { }

interface ProviderConstructor<T> {
  new(): Provider<T>;
}

interface ConsumerConstructor {
  new(): Consumer;
}

interface IOmiContext<T> {
  Provider: ProviderConstructor<T>
  Consumer: ConsumerConstructor
}

export default function createContext<T>(defaultValue: T): IOmiContext<T> {
  CPCount++
  const useContext = reactive<{ value: T }>({ value: defaultValue })
  return {
    Provider: (() => {
      class Provider extends WeElement<ProviderProps<T>> {
        render(props: Omi.RenderableProps<ProviderProps<T>>, store: IStore<T>) {
          const { value } = useContext.apply(this) as { value: T }
          store.context = props.value || value
          return props.children
        }
      }
      define(`o-provider-${CPCount}`, Provider)
      return Provider
    })(),
    Consumer: (() => {
      class Consumer extends WeElement<ConsumerProps> {
        render(props: Omi.RenderableProps<ConsumerProps>, store: IStore<T>) {
          const { children } = props
          return Array.isArray(children) && typeof children[0] === 'function'
            ? children[0](store.context || defaultValue)
            : children
        }
      }
      define(`o-consumer-${CPCount}`, Consumer)
      return Consumer
    })()
  }
}
