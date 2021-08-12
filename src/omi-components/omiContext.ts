import Omi, { define, WeElement } from 'omi'

let CPCount = 0

export interface ProviderProps<T> {
  state: T
}

export interface ProviderPropsWithSetter<T> extends ProviderProps<T> {
  setState(value: Partial<T> | ((preValue: T) => T | Partial<T>), callback?: (state: T) => void): void
}

export interface ConsumerProps { }

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
      provide: ProviderPropsWithSetter<T>;
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
        this.update()
        'function' === typeof callback && callback(this.state)
      }
      constructor() {
        super()
        this.provide = {
          state: this.state,
          setState: this.setState
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
      getChildren(props: Omi.OmiProps<any>): Omi.ComponentChildren {
        const { children } = props
        return Array.isArray(children) && children.length > 0
          ? children.map(child => this.getChildren(child))
          : typeof children === 'function'
            ? children(this.injection)
            : typeof children === 'object' && children && 'children' in children
              ? {
                ...children,
                children: this.getChildren(children)
              }
              : children
      }
      render(props: Omi.OmiProps<ConsumerProps>) {
        return this.getChildren(props)
      }
    }
    define(`o-consumer-${CPCount} `, Consumer)
    return Consumer
  })()
  return {
    Provider,
    Consumer,
    useContext: () => (new Provider()).provide
  }
}
