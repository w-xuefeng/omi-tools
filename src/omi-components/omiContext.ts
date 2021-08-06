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
      state = defaultValue
      setState = (value: Partial<T> | ((preValue: T) => T | Partial<T>), callback?: (state: T) => void) => {
        const nextPartialValue = typeof value === 'function' ? value(this.state) : value
        if (nextPartialValue && 'object' === typeof nextPartialValue) {
          this.state = Array.isArray(nextPartialValue)
            ? [...nextPartialValue] as unknown as T
            : {
              ...this.state,
              ...nextPartialValue
            }
        } else {
          this.state = nextPartialValue as T
        }
        this.forceUpdate()
        'function' === typeof callback && callback(this.state)
      }
      get context() {
        return {
          state: this.state,
          setState: this.setState
        }
      }
      install() {
        this.props.state && this.context.setState(this.props.state)
        // @ts-ignore
        this.store = { ...this.store, context: this.context }
      }
      render(props: Omi.OmiProps<ProviderProps<T>>, store: IStore<ProviderPropsWithSetter<T>>) {
        return props.children
      }
    }
    define(`o-provider-${CPCount}`, Provider)
    return Provider
  })()
  const Consumer = (() => {
    class Consumer extends WeElement<ConsumerProps> {
      render(props: Omi.OmiProps<ConsumerProps>, store: IStore<ProviderPropsWithSetter<T>>) {
        const { children } = props
        return Array.isArray(children)
          && typeof children[0] === 'function'
          && store
          && store.context
          ? children[0](store.context)
          : children
      }
    }
    define(`o-consumer-${CPCount}`, Consumer)
    return Consumer
  })()
  return {
    Provider,
    Consumer,
    useContext: () => Provider.prototype.context
  }
}
