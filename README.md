# omi-tools

Auxiliary tools for omi

[![NPM version](https://img.shields.io/npm/v/omi-tools?color=%23007acc&style=flat-square)](https://npmjs.org/package/omi-tools)
[![NPM downloads](https://img.shields.io/npm/dt/omi-tools?style=flat-square)](https://npmjs.org/package/omi-tools)

| tools            | params                                                                                                                                                                                   | returns                                                                                                 | desc                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| rmIEFP           | props: object                                                                                                                                                                            | props(without internal events):object                                                                   | remove internal events from props               |
| HF.camel2kebab   | name(camelCase/PascalCase): string                                                                                                                                                       | name(kebabCase): string                                                                                 | convert camelCase or PascalCase to kebabCase    |
| OC.makeFC        | `tagName`: `string`,<br>`render`: `(props: Omi.OmiProps<Props>, store: Store) => JSX.Element`,<br>`lifeTimes?`: `Partial<IOmiLifetimes<Props, Store>>`,<br>`extraStore?`: `Store` | `FunctionComponent`: `FCConstructor<Props, Store>`                                                      | generate a functional component element         |
| OC.reactive      | `data`: `object`                                                                                                                                                                         | `hooks`: `Function`                                                                                     | generate some reactive data                     |
| OC.createContext | `defaultValue`: any                                                                                                                                                                      | `IOmiContext<T>`: {<br>`Provider`: `ProviderConstructor<T>`, <br>`Consumer`: `ConsumerConstructor`<br>} | generate Provider/Consumer ComponentConstructor |
| OC.useContext    | `context`: {<br>`Provider`: `ProviderConstructor<T>`, <br>`Consumer`: `ConsumerConstructor`<br>},<Br>`thisArg?`:`Omi.WeElement<P>`                                                       | `value`: T                                                                                              | Context Consumer Hooks                          |
