import { define, WeElement } from 'omi'
import reactive from './reactive'

let CPCount = 0

export interface ProviderProps<T> {
  value: T
}

export interface ProviderPropsWithSetter<T> extends ProviderProps<T> {
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
  const defaultContext = {
    value: defaultValue,
    setValue(value: T) {
      this.value = value
    }
  }
  const useContext = reactive<ProviderPropsWithSetter<T>>(defaultContext)
  return {
    Provider: (() => {
      class Provider extends WeElement<ProviderProps<T>> {
        context: ProviderPropsWithSetter<T> = defaultContext
        install() {
          this.context = useContext.apply(this) as ProviderPropsWithSetter<T>
          this.context.setValue(this.props.value || this.context.value)
        }
        render(props: Omi.RenderableProps<ProviderProps<T>>, store: IStore<ProviderPropsWithSetter<T>>) {
          store.context = this.context
          return props.children
        }
      }
      define(`o-provider-${CPCount}`, Provider)
      return Provider
    })(),
    Consumer: (() => {
      class Consumer extends WeElement<ConsumerProps> {
        render(props: Omi.RenderableProps<ConsumerProps>, store: IStore<ProviderPropsWithSetter<T>>) {
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
