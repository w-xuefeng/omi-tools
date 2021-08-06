import { define, WeElement } from 'omi'

let CPCount = 0

export interface ProviderProps<T> {
  state: T
}

export interface ProviderPropsWithSetter<T> extends ProviderProps<T> {
  setState(value: Partial<T> | ((preValue: T) => T | Partial<T>), callback?: (state: T) => void): void
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
  const Provider = (() => {
    class Provider extends WeElement<ProviderProps<T>> {
      provide = {
        state: defaultValue,
        setState: (value: Partial<T> | ((preValue: T) => T | Partial<T>), callback?: (state: T) => void) => {
          const nextPartialValue = typeof value === 'function' ? value(this.provide.state) : value
          if (nextPartialValue && 'object' === typeof nextPartialValue) {
            this.provide.state = Array.isArray(nextPartialValue)
              ? [...nextPartialValue] as unknown as T
              : {
                ...this.provide.state,
                ...nextPartialValue
              }
          } else {
            this.provide.state = nextPartialValue as T
          }
          this.update()
          'function' === typeof callback && callback(this.provide.state)
        }
      }
      render(props: Omi.OmiProps<ProviderProps<T>>) {
        return props.children
      }
    }
    define(`o-provider-${CPCount}`, Provider)
    return Provider
  })()
  const Consumer = (() => {
    class Consumer extends WeElement<ConsumerProps> {
      inject = ['state', 'setState']
      render(props: Omi.OmiProps<ConsumerProps>) {
        const { children } = props
        return Array.isArray(children)
          && typeof children[0] === 'function'
          ? children[0](this.injection)
          : children
      }
    }
    define(`o-consumer-${CPCount}`, Consumer)
    return Consumer
  })()
  return {
    Provider,
    Consumer,
    useContext: () => (new Provider()).provide
  }
}
