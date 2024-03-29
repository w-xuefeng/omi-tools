import { define, WeElement } from 'omi'

export interface IOmiLifetimes<Props, Store> extends Omi.WeElement<Props> {
  staticCss?: string | CSSStyleSheet | (string | CSSStyleSheet)[]
  propTypes?: Record<string, any>
  defaultProps?: Record<string, any>
  isLightDom?: boolean
  compute?: any
  renderWithThis(props: Omi.OmiProps<Props>, store: Store, componentContext: Omi.WeElement<Props>): JSX.Element | Omi.ComponentChild | undefined
}

export function checkLifeOptionsRun<Props, Store>(
  options: Partial<IOmiLifetimes<Props, Store>>,
  lifeTime: keyof IOmiLifetimes<Props, Store>,
  context: Omi.WeElement,
  args?: any[]
) {
  return options && typeof options[lifeTime] === 'function' && options[lifeTime].apply(context, args)
}

export interface FC<Props, Store> extends Omi.WeElement<Props> {
  render(props: Omi.OmiProps<Props>, store: Store): Omi.ComponentChildren
}

export interface FCConstructor<Props, Store> {
  new(): FC<Props, Store>;
}

export function createFunctionComp<Props = any, Store = any>(
  tagName: string,
  options: Partial<IOmiLifetimes<Props, Store>>,
  extraStore?: Store,
  BaseFComponent: typeof WeElement = WeElement
): FCConstructor<Props, Store> {
  class FC<Props, Store> extends BaseFComponent<Props> {
    static css = options.staticCss || ''
    static propTypes = options.propTypes
    static defaultProps = options.defaultProps
    static isLightDom = options.isLightDom
    compute = options.compute
    render(props: Omi.OmiProps<Props>, store: Store) {
      return checkLifeOptionsRun(options, 'renderWithThis', this as Omi.WeElement, [props, { ...store, ...extraStore }, this])
    }
  }

  const hasDefinedK = [
    'staticCss',
    'propTypes',
    'defaultProps',
    'isLightDom',
    'compute',
    'render'
  ]

  Object.keys(options).filter(k => !hasDefinedK.includes(k)).forEach(k => {
    const lifetime = options[k as keyof typeof options]
    if (typeof lifetime === 'function') {
      Object.defineProperty(FC.prototype, k, {
        value: function() {
          return lifetime.apply(this, arguments)
        }
      })
    }
  })

  define(tagName.startsWith('o-') ? tagName : `o-${tagName}`, FC)
  return FC
}

export function makeFC<Props extends {} = any, Store extends {} = any>(
  tagName: string,
  render: IOmiLifetimes<Props, Store>['renderWithThis'],
  lifeTimes?: Partial<IOmiLifetimes<Props, Store>>,
  extraStore?: Store
) {
  return createFunctionComp<Props, Store>(
    tagName,
    { ...lifeTimes, renderWithThis: render },
    extraStore
  )
}

export default makeFC
