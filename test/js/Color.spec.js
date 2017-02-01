import Color from '../../src/js/Color'
import colorData from '../data/colors/6BD10E'
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
      expect(color.getUrl).to.be.a('function')
      expect(color.getUrl()).to.be.null
      expect(color.create).to.be.a('function')
      expect(color.get).to.be.a('function')
      let badColor = Color.create('fff')
      expect(badColor.hex).to.be.null
      expect(badColor.getUrl()).to.be.null

      let goodColor = Color.create('ffffff')
      expect(goodColor.hex).to.equal('FFFFFF')
      expect(goodColor.getUrl()).to.equal(
        'http://www.colourlovers.com/api/color/FFFFFF?format=json'
      )
    })
  })
  describe('get()', () => {
    before(() => {
      nock('http://www.colourlovers.com')
        .get('/api/color/FFFFFF?format=json')
        .reply(200, colorData)
      nock('http://www.colourlovers.com')
        .get('/api/color/ABCDEF?format=json')
        .reply(200, [])
      nock('http://www.colourlovers.com')
        .get('/api/color/100000?format=json')
        .reply(400)
    })
    it('should properly convert GET responses into objects', (done) => {
      let color = Color.create('FFFFFF')
      color.get().then(() => {
        expect(color.title).to.equal(colorData[0].title)
        expect(color.rgb).to.deep.equal(colorData[0].rgb)
        done()
      }).catch(() => {
        done()
      })
    })
    it('should handle a response with an empty array', (done) => {
      let color = Color.create('ABCDEF')
      color.get().then(() => {
        done()
      }).catch(() => {
        done()
      })
    })
    it('should handle a response failure', (done) => {
      let color = Color.create('100000')
      color.get().then(() => {
        done()
      }).catch(() => {
        done()
      })
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
