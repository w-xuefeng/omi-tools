export default function camel2kebab(name: string) {
  return (name || '')
    .replace(/[A-Z]/g, (str) => {
      return `-${str.toLocaleLowerCase()}`
    })
    .replace(/^(-)/, '')
}
