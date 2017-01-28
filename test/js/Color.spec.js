import Color from '../../src/js/Color'
import colorData from '../data/color'
import { expect } from 'chai'
import 'isomorphic-fetch'
import nock from 'nock'
import { polyfill } from 'es6-promise'

polyfill()

describe('Color', () => {
  describe('create()', () => {
    it('should properly create a new color object', () => {
      let color = Color.create()
      expect(color.hex).to.be.null
      expect(color.title).to.be.null
      expect(color.rgb).to.be.null
      expect(color.url).to.be.null
      expect(color.create).to.be.a('function')
      expect(color.get).to.be.a('function')
      expect(color.handleSuccess).to.be.a('function')
      let badColor = Color.create('fff')
      expect(badColor.hex).to.be.null
      let goodColor = Color.create('ffffff')
      expect(goodColor.hex).to.equal('FFFFFF')
      expect(goodColor.url).to.equal('http://www.colourlovers.com/api/color/FFFFFF?format=json')
    })
  })
  describe('get()', () => {
    before(() => {
      nock('http://www.colourlovers.com').get('/api/color/FFFFFF?format=json').reply(200, colorData)
      nock('http://www.colourlovers.com').get('/api/color/ABCDEF?format=json').reply(200, [])
      nock('http://www.colourlovers.com').get('/api/color/000000?format=json').reply(400)
    })
    it('should properly convert GET responses into objects', (done) => {
      let color = Color.create('FFFFFF')
      color.get((data) => {
        try {
          data = data[0]
          color.rgb = data.rgb
          color.title = data.title
          expect(color.rgb).to.deep.equal(colorData[0].rgb)
          expect(color.title).to.equal(colorData[0].title)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
    it('should handle a response with an empty array', (done) => {
      let color = Color.create('ABCDEF')
      color.get((data) => {
        try {
          expect(data).to.be.empty
          done()
        } catch (error) {
          done(error)
        }
      })
    })
    it('should handle a response failure', (done) => {
      let color = Color.create('000000')
      color.get(() => {}, () => {
        try {
          expect(color.error).to.deep.equal({
            status: 400,
            message: 'Bad Request'
          })
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })
  describe('handleSuccess()', () => {
    it('should correctly map data', () => {
      let color = Color.create()
      color.handleSuccess(colorData)
      expect(color.title).to.equal(colorData[0].title)
      expect(color.rgb).to.deep.equal(colorData[0].rgb)
    })
  })
  describe('isValidHex()', () => {
    it('should properly validate a hexidemical color value', () => {
      let color = Color.create()
      expect(color.isValidHex()).to.be.false
      expect(color.isValidHex('FFFFFF')).to.be.true
      expect(color.isValidHex('FFF')).to.be.false
      expect(color.isValidHex('06zA08')).to.be.false
      expect(color.isValidHex('06AFE6')).to.be.true
    })
  })
})
