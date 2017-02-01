import Color from './Color'
import 'isomorphic-fetch'
import { polyfill } from 'es6-promise'

polyfill()

export default {
  create (id = null) {
    return Object.assign(Object.create(this), {
      author: null,
      colors: [],
      error: null,
      id,
      title: null,
      getUrl () {
        return `
          http://www.colourlovers.com/api/palette/
          ${encodeURIComponent(id)}?format=json
        `.replace(/\s+/g, '')
      }
    })
  },
  get () {
    return new Promise((resolve, reject) => {
      if (this.id) {
        fetch(this.getUrl()).then((response) => {
          if (response.status >= 400) {
            throw new Error(JSON.stringify({
              status: response.status,
              statusText: response.statusText
            }))
          }
          return response.json()
        }).then((data) => {
          if (data.length === 1) {
            data = data[0]
            this.author = data.userName
            this.title = data.title
            this.colors = data.colors
            resolve(this)
          } else {
            reject(`Palette ${this.id} contained no data.`)
          }
        }).catch((error) => {
          this.error = JSON.parse(error.toString().replace('Error: ', ''))
          reject()
        })
      } else {
        reject(`No ID was supplied`)
      }
    })
  }
}
