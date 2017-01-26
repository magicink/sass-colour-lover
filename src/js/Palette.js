import Color from './Color'
import 'isomorphic-fetch'
import { polyfill } from 'es6-promise'

polyfill()

export default {
  create (id = null) {
    let url = (id) ? `http://www.colourlovers.com/api/palette/${encodeURIComponent(id)}?format=json` : null
    return Object.assign({
      author: null,
      colors: [],
      error: null,
      get (success, failure) {
        if (this.id && this.url) {
          if (!failure) {
            failure = (error) => {
              console.log(error.toString())
            }
          }
          if (!success) {
            success = (data) => {
              if (data.length === 1) {
                data = data[0]
                this.author = data.userName
                this.title = data.title
                let colors = data.colors
              }
            }
          }
          fetch(this.url).then((response) => {
            if (response.status >= 400) {
              this.error = {
                status: response.status,
                message: response.statusText
              }
              throw new Error(`${response.status} - ${response.statusText}\r\n${response.url}`)
            }
            return response.json()
          }).then(success).catch(failure)
        }
      },
      id,
      title: null,
      url
    })
  }
}
