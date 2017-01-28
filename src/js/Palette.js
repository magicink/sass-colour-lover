import Color from './Color'
import 'isomorphic-fetch'
import { polyfill } from 'es6-promise'

polyfill()

export default {
  composeUrl (id) {
    return `
      http://www.colourlovers.com/api/palette/
      ${encodeURIComponent(id)}?format=json
    `.replace(/\s+/g, '')
  },
  create (id = null) {
    let url = (id) ? this.composeUrl(id) : null
    return Object.assign(Object.create(this), {
      author: null,
      colors: [],
      error: null,
      id,
      title: null,
      url
    })
  },
  get (success = this.handleSuccess.bind(this), failure) {
    if (this.id && this.url) {
      if (!failure) {
        failure = (error) => {
          this.error = JSON.parse(error.toString().replace('Error: ', ''))
        }
      }
      fetch(this.url).then((response) => {
        if (response.status >= 400) {
          throw new Error(JSON.stringify({
            status: response.status,
            statusText: response.statusText
          }))
        }
        return response.json()
      }).then(success).catch(failure)
    }
  },
  handleSuccess (data) {
    if (data.length === 1) {
      data = data[0]
      this.author = data.userName || null
      this.title = data.title || null
      for (let index = 0; index < data.colors.length; index++) {
        let color = Color.create(data.colors[index])
        try {
          color.get((data) => {
            if (data.length === 1) {
              data = data[0]
              color.rgb = data.rgb
              color.title = data.title
              this.colors.push(color)
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    return new Promise((resolve, reject) => {
      resolve(this)
    })
  },
  setId (id) {
    if (id && id !== this.id) {
      this.author = null
      this.colors = []
      this.id = id
      this.title = null
      this.url = this.composeUrl(id)
    }
  }
}
