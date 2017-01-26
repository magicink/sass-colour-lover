import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'

polyfill()

export default {
  create (id = null) {
    let url = (id) ? `http://www.colourlovers.com/api/palette/${encodeURIComponent(id)}?format=json` : null
    return Object.assign({
      author: null,
      colors: [],
      get (callback) {
        if (!callback) {
          callback = (data) => {
            if (data.length === 1) {
              data = data[0]
              this.author = data.userName
              this.hexColors = data.colors
              this.title = data.title
            }
          }
        }
        if (this.id && this.url) {
          fetch(this.url).then((response) => {
            if (response.status >= 400) {
              throw new Error('Bad server response')
            }
            return response.json()
          }).then(callback)
        }
      },
      hexColors: [],
      id,
      title: null,
      url
    })
  }
}
