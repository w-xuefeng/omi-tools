import { define, WeElement } from 'omi'

export interface IOmiLifetimes<Props, Store> {
  install?(): void
  installed?(): void
  uninstall?(): void
  beforeUpdate?(): void
  updated?(): void
  beforeRender?(): void
  receiveProps?(props: Omi.RenderableProps<Props>, oldProps: Omi.RenderableProps<Props>): void
  render(props: Omi.RenderableProps<Props>, store: Store): JSX.Element | Omi.ComponentChild
}

export function checkLifeOptionsRun<Props, Store>(
  options: IOmiLifetimes<Props, Store>,
  lifeTime: keyof IOmiLifetimes<Props, Store>,
  context: WeElement,
  args?: any[]
) {
  // @ts-ignore
  return options && typeof options[lifeTime] === 'function' && options[lifeTime].apply(context, args)
}

export interface FC<Props, Store> extends Omi.WeElement<Props> { }

export interface FCConstructor<Props, Store> {
  new(): FC<Props, Store>;
}

export function createFunctionComp<Props = any, Store = any>(
  tagName: string,
  options: IOmiLifetimes<Props, Store>,
  extraStore?: Store,
  BaseFComponent: typeof WeElement = WeElement,
): FCConstructor<Props, Store> {
  class FC<Props, Store> extends BaseFComponent<Props>{
    install() {
      checkLifeOptionsRun(options, 'install', this)
    }
    installed() {
      console.log('orgin-installed')
      checkLifeOptionsRun(options, 'installed', this)
    }
    uninstall() {
      checkLifeOptionsRun(options, 'uninstall', this)
    }
    beforeUpdate() {
      checkLifeOptionsRun(options, 'beforeUpdate', this)
    }
    updated() {
      checkLifeOptionsRun(options, 'updated', this)
    }
    beforeRender() {
      checkLifeOptionsRun(options, 'beforeRender', this)
    }
    receiveProps(props: Omi.RenderableProps<Props>, oldProps: Omi.RenderableProps<Props>) {
      checkLifeOptionsRun(options, 'receiveProps', this, [props, oldProps])
    }
    render(props: Omi.RenderableProps<Props>, store: Store) {
      return checkLifeOptionsRun(options, 'render', this, [props, { ...store, ...extraStore }])
    }
  }
  define(tagName.startsWith('o-') ? tagName : `o-${tagName}`, FC)
  return FC
}

export function makeFC<Props extends {} = any, Store extends {} = any>(
  tagName: string,
  render: (props: Omi.RenderableProps<Props>, store: Store) => JSX.Element | Omi.ComponentChild,
  lifeTimes?: Partial<IOmiLifetimes<Props, Store>>,
  extraStore?: Store
) {
  return createFunctionComp<Props, Store>(
    tagName,
    { ...lifeTimes, render },
    extraStore
  )
}

export default makeFC
