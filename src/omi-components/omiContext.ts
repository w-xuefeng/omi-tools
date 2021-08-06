import { define, WeElement } from 'omi'
import reactive from './reactive'

let CPCount = 0

export interface ProviderProps<T> {
  value: T
}

export interface ProviderPropsWithSetter<T> extends ProviderProps<T> {
  setValue(value: Partial<T> | ((preValue: T) => T | Partial<T>)): void
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
    setValue(value: Partial<T> | ((preValue: T) => T | Partial<T>)) {
      const nextPartialValue = typeof value === 'function' ? value(this.value) : value
      if (nextPartialValue && 'object' === typeof nextPartialValue) {
        this.value = Array.isArray(nextPartialValue)
          ? [...nextPartialValue] as unknown as T
          : {
            ...this.value,
            ...nextPartialValue
          }
      } else {
        this.value = nextPartialValue as T
      }
    }
  }
  const useContext = reactive<ProviderPropsWithSetter<T>>(defaultContext)
  return {
    Provider: (() => {
      class Provider extends WeElement<ProviderProps<T>> {
        install() {
          const context = useContext.apply(this) as ProviderPropsWithSetter<T>
          context.setValue(this.props.value || context.value)
          // @ts-ignore
          this.store = { ...this.store, context }
        }
        render(props: Omi.OmiProps<ProviderProps<T>>, store: IStore<ProviderPropsWithSetter<T>>) {
          return props.children
        }
      }
      define(`o-provider-${CPCount}`, Provider)
      return Provider
    })(),
    Consumer: (() => {
      class Consumer extends WeElement<ConsumerProps> {
        render(props: Omi.OmiProps<ConsumerProps>, store: IStore<ProviderPropsWithSetter<T>>) {
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
