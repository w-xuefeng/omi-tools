export default function camel2kebab(name: string) {
  return (name || '')
    .replace(new RegExp(/[A-Z]/, "g"), (str) => {
      return `-${str.toLocaleLowerCase()}`;
    })
    .replace(/^(-)/, '');
}
