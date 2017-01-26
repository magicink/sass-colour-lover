import Color from '../../src/js/Color'
import { expect } from 'chai'
import nock from 'nock'
import { polyfill } from 'es6-promise'

polyfill()

describe('Color', () => {
  describe('create', () => {
    it('should properly create a new color object', () => {
      let color = Color.create()
    })
  })
})
