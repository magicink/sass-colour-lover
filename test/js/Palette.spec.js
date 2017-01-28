import { expect } from 'chai'
import 'isomorphic-fetch'
import nock from 'nock'
import Palette from '../../src/js/Palette'
import paletteData from '../data/palette.json'
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
  })
  describe('create()', () => {
    it('should properly create a palette', () => {
      let palette = Palette.create()
      expect(palette.author).to.be.null
      expect(palette.colors).to.be.empty
      expect(palette.id).to.be.null
      expect(palette.title).to.be.null
      expect(palette.url).to.be.null
      expect(palette.create).to.be.a('function')
      expect(palette.get).to.be.a('function')
      expect(palette.handleSuccess).to.be.a('function')
    })
    it('should properly handle parameters', () => {
      let palette = Palette.create('123')
      expect(palette.id).to.equal('123')
      expect(palette.url).to.deep.equal(
        'http://www.colourlovers.com/api/palette/123?format=json'
      )
      palette = Palette.create('star wars')
      expect(palette.url).to.deep.equal(
        'http://www.colourlovers.com/api/palette/star%20wars?format=json'
      )
    })
  })
  describe('get()', () => {
    it('should properly convert GET responses into objects', (done) => {
      let palette = Palette.create(123)
      palette.get((data) => {
        expect(data.length).to.equal(1)
        data = data[0]
        palette.author = data.userName
        palette.title = data.title
        palette.colors = data.colors
        try {
          expect(palette.author).to.equal(paletteData[0].userName)
          expect(palette.colors).to.deep.equal(paletteData[0].colors)
          expect(palette.title).to.be.equal(paletteData[0].title)
          done()
        } catch (error) {
          done(error)
        }
      })
    })
    it('should handle an empty array as a response', (done) => {
      let palette = Palette.create('star wars')
      palette.get((data) => {
        try {
          expect(data).to.be.empty
          expect(data).to.be.empty
          expect(palette.author).to.be.null
          expect(palette.title).to.be.null
          expect(palette.colors).to.be.empty
          done()
        } catch (error) {
          done(error)
        }
      })
    })
    it('should handle response failure', (done) => {
      let palette = Palette.create(456)

      palette.get(() => {}, () => {
        try {
          expect(palette.error).to.deep.equal({
            status: 400,
            message: 'Bad Request'
          })
          expect(palette.author).to.be.null
          expect(palette.title).to.be.null
          expect(palette.colors).to.be.empty
          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })
  describe('handleSuccess()', () => {
    it('should properly map values', () => {
      let palette = Palette.create(789)
      palette.handleSuccess(paletteData)
      expect(palette.colors).to.deep.equal(paletteData[0].colors)
    })
  })
})
