export default function({app}) {
  return {
    lang: {
      t: (key, ...params) => app.i18n.t(key, params),
    }
  }
}