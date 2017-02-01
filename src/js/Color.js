import 'isomorphic-fetch'
import { polyfill } from 'es6-promise'

polyfill()

export default {
  create (hex = '') {
    hex = hex.toUpperCase()
    const isValid = this.isValidHex(hex)
    return Object.assign(Object.create(this), {
      error: null,
      getUrl () {
        if (this.isValidHex(hex)) {
          return `http://www.colourlovers.com/api/color/${hex}?format=json`
        } else {
          return null
        }
      },
      hex: (isValid) ? hex : null,
      rgb: null,
      title: null
    })
  },
  get () {
    return new Promise((resolve, reject) => {
      if (this.hex && this.url) {
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
            this.rgb = data.rgb
            this.title = data.title
            resolve(this)
          } else {
            reject(`Color ${this.hex} contained no data.`)
          }
        }).catch((error) => {
          this.error = JSON.parse(error.toString().replace('Error: ', ''))
          reject()
        })
      } else {
        reject()
      }
    })
  },
  isValidHex (hex = '') {
    let valid = true
    hex = hex.split('')
    if (hex.length === 6) {
      const chars = new Set(hex)
      const validChars = new Set('0123456789ABCDEF'.split(''))
      for (let char of chars) {
        if (validChars.has(char) === false) {
          valid = false
          break
        }
      }
    } else {
      valid = false
    }
    return valid
  }
}
