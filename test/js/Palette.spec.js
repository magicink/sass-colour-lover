import { expect } from 'chai'
import 'isomorphic-fetch'
import nock from 'nock'
import Palette from '../../src/js/Palette'
import { polyfill } from 'es6-promise'
import sinon from 'sinon'

polyfill()

describe('Palette', () => {
  describe('create()', () => {
    it('should properly create a palette', () => {
      let palette = Palette.create()
      expect(palette.author).to.equal(null)
      expect(palette.colors).to.deep.equal([])
      expect(palette.id).to.equal(null)
      expect(palette.title).to.equal(null)
      expect(palette.url).to.equal(null)
      expect(palette.get).to.be.a('function')
    })
    it('should properly handle parameters', () => {
      let palette = Palette.create('123')
      expect(palette.id).to.equal('123')
      expect(palette.url).to.deep.equal('http://www.colourlovers.com/api/palette/123?format=json')
      palette = Palette.create('star wars')
      expect(palette.url).to.deep.equal('http://www.colourlovers.com/api/palette/star%20wars?format=json')
    })
  })
  describe('get()', () => {
    let fakeData = [{
      'id': 123,
      'title': 'Kurasaibo',
      'userName': 'rageforst',
      'numViews': 1516,
      'numVotes': 25,
      'numComments': 1,
      'numHearts': 0,
      'rank': 0,
      'dateCreated': '2005-06-04 23:00:34',
      'colors': ['FF0033', '000000', 'AEF504', 'EDE6EC'],
      'description': `ochi tochi morochi toshy....\r\ntakaque maseguata...wokitoki,\r\nshiro lama Kurasuraibo, nico\r\nkasuuuuu\r\n\r\nOkira yokisan karate shiro kato!!!\n\nthe Liquits, Mexican rock group`,
      'url': 'http://www.colourlovers.com/palette/123/Kurasaibo',
      'imageUrl': 'http://www.colourlovers.com/paletteImg/FF0033/000000/AEF504/EDE6EC/Kurasaibo.png',
      'badgeUrl': 'http://www.colourlovers.com/images/badges/p/0/123_Kurasaibo.png',
      'apiUrl': 'http://www.colourlovers.com/api/palette/123'
    }]
    before(() => {
      nock('http://www.colourlovers.com').get('/api/palette/123?format=json').reply(200, fakeData)
      nock('http://www.colourlovers.com').get('/api/palette/456?format=json').reply(400, fakeData)
    })
    it('should properly convert GET requests into objects', (done) => {
      let palette = Palette.create(123)
      palette.get((data) => {
        if (data.length === 1) {
          data = data[0]
          palette.author = data.userName
          palette.title = data.title
          palette.colors = data.colors
          try {
            expect(palette.author).to.be.equal(fakeData[0].userName)
            expect(palette.colors).to.be.deep.equal(fakeData[0].colors)
            expect(palette.title).to.be.equal(fakeData[0].title)
            done()
          } catch (error) {
            done(error)
          }
        }
      })
    })
    it('should handle response failure', (done) => {
      let successSpy = sinon.spy()
      let palette = Palette.create(456)

      palette.get(successSpy, (error) => {
        try {
          expect(palette.error).to.deep.equal({
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
})
