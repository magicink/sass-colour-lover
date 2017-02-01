export default [
  {
    alias: 'i',
    name: 'ids',
    multiple: true,
    typeLabel: '[underline]{palette_id}',
    description: `
      [bold]{Required}. The space-separated ID(s) of the palettes you wish
      to convert.
    `.replace(/\s+/g, ' ').trim()
  },
  {
    alias: 'f',
    name: 'format',
    defaultOption: true,
    defaultValue: 'rgb',
    description: 'The output format of the color ([bold]{default:} rgb).',
    typeLabel: '[underline]{rgb|hex}'
  },
  {
    name: 'output',
    alias: 'o',
    defaultValue: '_palette.scss',
    description: `
      The name of the file that is generated
      ([bold]{default:} _palette.scss).
    `.replace(/\s+/g, ' ').trim()
  },
  {
    alias: 'h',
    name: 'help',
    description: 'Displays this documentation'
  }
]
