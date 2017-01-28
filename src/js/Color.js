import 'isomorphic-fetch'
import { polyfill } from 'es6-promise'

polyfill()

/**
 * Color
 */
export default {
  create (hex = '') {
    hex = hex.toUpperCase()
    const isValid = this.isValidHex(hex)
    return Object.assign(Object.create(this), {
      error: null,
      hex: (isValid) ? hex : null,
      rgb: null,
      title: null,
      url: (isValid) ? `http://www.colourlovers.com/api/color/${hex}?format=json` : null
    })
  },
  get (success = this.handleSuccess.bind(this), failure) {
    if (this.hex) {
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
      this.rgb = data.rgb || null
      this.title = data.title || null
    }
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
