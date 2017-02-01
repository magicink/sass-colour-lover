import colorData from '../data/colors/6BD10E'
import { expect } from 'chai'
import 'isomorphic-fetch'
import nock from 'nock'
import Palette from '../../src/js/Palette'
import paletteData from '../data/palettes/123'
import { polyfill } from 'es6-promise'

polyfill()

describe('Palette', () => {
  before(() => {
    nock('http://www.colourlovers.com')
      .get('/api/palette/123?format=json')
      .reply(200, paletteData)
    nock('http://www.colourlovers.com')
      .get('/api/palette/star%20wars?format=json')
      .reply(200, [])
    nock('http://www.colourlovers.com')
      .get('/api/palette/456?format=json')
      .reply(400)
    nock('http://www.colourlovers.com')
      .get('/api/palette/789?format=json')
      .reply(200, paletteData)
    nock('http://www.colourlovers.com')
      .get('/api/palette/101112?format=json')
      .reply(200, paletteData)
    nock('http://www.colourlovers.com')
      .get('/api/color/FF0033?format=json')
      .reply(200, colorData)
    nock('http://www.colourlovers.com')
      .get('/api/color/000000?format=json')
      .reply(200, colorData)
    nock('http://www.colourlovers.com')
      .get('/api/color/AEF504?format=json')
      .reply(200, colorData)
    nock('http://www.colourlovers.com')
      .get('/api/color/EDE6EC?format=json')
      .reply(200, colorData)
  })
  describe('create()', () => {
    it('should properly create a palette', () => {
      let palette = Palette.create()
      expect(palette.author).to.be.null
      expect(palette.colors).to.be.empty
      expect(palette.id).to.be.null
      expect(palette.title).to.be.null
      expect(palette.create).to.be.a('function')
      expect(palette.get).to.be.a('function')
      expect(palette.getUrl).to.be.a('function')
    })
    it('should properly handle parameters', () => {
      let palette = Palette.create('123')
      expect(palette.id).to.equal('123')
      expect(palette.getUrl()).to.equal(
        'http://www.colourlovers.com/api/palette/123?format=json'
      )
      palette = Palette.create('star wars')
      expect(palette.getUrl()).to.equal(
        'http://www.colourlovers.com/api/palette/star%20wars?format=json'
      )
    })
  })
  describe('get()', () => {
    it('should properly convert GET responses into objects', (done) => {
      let palette = Palette.create(123)
      palette.get().then(() => {
        expect(palette.author).to.equal(paletteData[0].userName)
        expect(palette.colors).to.deep.equal(paletteData[0].colors)
        expect(palette.title).to.be.equal(paletteData[0].title)
        done()
      })
    })
    it('should handle an empty array as a response', (done) => {
      let palette = Palette.create('star wars')
      palette.get().then(() => {
        done()
      }).catch((error) => {
        expect(error.toString()).to.equal('Palette star wars contained no data.')
        done()
      })
    })
    it('should handle response failure', (done) => {
      let palette = Palette.create(456)
      palette.get().then(() => {
        done()
      }).catch((error) => {
        expect(palette.error).to.deep.equal({
          status: 400,
          statusText: 'Bad Request'
        })
        done()
      })
    })
  })
})
