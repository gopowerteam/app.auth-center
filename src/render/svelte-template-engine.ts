import 'svelte/register'
import * as svelte from 'svelte/compiler'

export function svelteTemplateEngine(
  filePath: string,
  options: any,
  next
) {
  if (process.env.NODE_ENV === 'development') {
    Object.keys(require.cache)
      .filter(key => key.endsWith('.svelte'))
      .forEach(key => {
        delete require.cache[key]
      })
  }

  const App = require(filePath).default
  const { html, head, css } = App.render(options)
  const js = svelte.compile(filePath).js.code
  const appendHeader = `${head}<style>${css.code}</style><script>${js}</script>`
  console.log(js)
  next(null, html.replace('%head%', appendHeader))
}
