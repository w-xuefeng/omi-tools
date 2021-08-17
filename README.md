# omi-tools

Auxiliary tools for omi

[![NPM version](https://img.shields.io/npm/v/omi-tools?color=%23007acc&style=flat-square)](https://npmjs.org/package/omi-tools)
[![NPM downloads](https://img.shields.io/npm/dt/omi-tools?style=flat-square)](https://npmjs.org/package/omi-tools)

| tools                             | params                                                                                                                                                                            | returns                                                                                                 | desc                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [rmIEFP](#rmIEFP)                 | props: object                                                                                                                                                                     | props(without internal events):object                                                                   | remove internal events from props                                          |
| [HF.camel2kebab](#HF.camel2kebab) | name(camelCase/PascalCase): string                                                                                                                                                | name(kebabCase): string                                                                                 | convert camelCase or PascalCase to kebabCase                               |
| [OC.makeFC](#OC.makeFC)           | `tagName`: `string`,<br>`render`: `(props: Omi.OmiProps<Props>, store: Store) => JSX.Element`,<br>`lifeTimes?`: `Partial<IOmiLifetimes<Props, Store>>`,<br>`extraStore?`: `Store` | `FunctionComponent`: `FCConstructor<Props, Store>`                                                      | generate a component or element in the form of render-function declaration |
| [OC.reactive](#OC.reactive)           | `data`: `object`                                                                                                                                                                  | `hooks`: `Function`                                                                                     | generate some reactive data                                                |
| [OC.createContext](#OC.createContext)   | `defaultValue`: any                                                                                                                                                               | `IOmiContext<T>`: {<br>`Provider`: `ProviderConstructor<T>`, <br>`Consumer`: `ConsumerConstructor`<br>} | generate Provider/Consumer ComponentConstructor                            |
| [OC.useContext](#OC.useContext)       | `context`: {<br>`Provider`: `ProviderConstructor<T>`, <br>`Consumer`: `ConsumerConstructor`<br>}                                                                                  | `value`: T                                                                                              | Context Consumer Hooks                                                     |
| OH.useMemo                        | `callback`: `() => T`,<br>`deps`: `any[]`,<br>`shouldUpdated?: (prevDeps: any[], nextDeps: any[]) => boolean`                                                                     | `computedData`: `T`                                                                                     | computed and memorize result at same dependencies                          |

# Explanation

<h2 id="rmIEFP">rmIEFP</h2>

- desc: remove internal events like `onClick` from props to avoid multiple binding times
- usecase:

  ```tsx
  import { Component, h, tag } from 'omi'
  import { rmIEFP } from 'omi-tools'
  import css from '_style.less'

  const tagName = 'o-title'

  interface ITitleProps {
    className?: string
    style?: string
    title: string
    onClick?: (e: MouseEvent) => void
  }

  declare global {
    namespace JSX {
      interface IntrinsicElements {
        [tagName]: Omi.Props & Partial<ITitleProps>
      }
    }
  }

  @tag(tagName)
  export default class Title extends Component<ITitleProps> {
    static css = css
    render(props: Omi.OmiProps<ITitleProps>) {
      return <h1 {...rmIEFP(props)}>{props.title}</h1>
    }
  }
  ```

<h2 id="HF.camel2kebab">HF.camel2kebab</h2>

- desc: convert variable name from camelCase or PascalCase form to kebabCase form
- usecase:

  ```ts
  import { HF } from 'omi-tools'
  const tagName = HF.camel2kebab('MyCustomElementName');
  // > tagName: `my-custom-element-name`
  ```

<h2 id="OC.makeFC">OC.makeFC</h2>

- desc: generate a component or element in the form of render-function declaration
- usecase:

  ```tsx
  import { OC, rmIEFP } from 'omi-tools'
  import css from '_style.less'

  const tagName = 'o-h1-title'

  interface ITitleProps {
    className?: string
    style?: string
    title: string
    onClick?: (e: MouseEvent) => void
  }

  declare global {
    namespace JSX {
      interface IntrinsicElements {
        [tagName]: Omi.Props & Partial<ITitleProps>
      }
    }
  }

  const Title = OC.makeFC<ITitleProps>(
    tagName,
    props => <h1 {...rmIEFP(props)}>{props.title}</h1>,
    { staticCss: css }
  )

  export default Title
  ```


<h2 id="OC.reactive">OC.reactive</h2>

- desc: generate some reactive data
- usecase: [https://codepen.io/w-xuefeng/pen/ZEKNyLm](https://codepen.io/w-xuefeng/pen/ZEKNyLm?editors=001)

<h2 id="OC.createContext">OC.createContext</h2>

- desc: generate Provider/Consumer ComponentConstructor
- usecase: [https://codepen.io/w-xuefeng/pen/LYyxqLo](https://codepen.io/w-xuefeng/pen/LYyxqLo?editors=001)

<h2 id="OC.useContext">OC.useContext</h2>

- desc: context Consumer Hooks
- usecase: [https://codepen.io/w-xuefeng/pen/LYyxqLo](https://codepen.io/w-xuefeng/pen/LYyxqLo?editors=001)
