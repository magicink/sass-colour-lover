import paletteData from './data/palette.json'
import colorData from './data/color.json'
import nock from 'nock'

nock('http://www.colourlovers.com').get('/api/palette/123?format=json').reply(200, paletteData)
nock('http://www.colourlovers.com').get('/api/palette/star%20wars?format=json').reply(200, [])
nock('http://www.colourlovers.com').get('/api/palette/456?format=json').reply(400)
nock('http://www.colourlovers.com').get('/api/color/FFFFFF?format=json').reply(200, colorData)
