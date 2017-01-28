export default [
  {
    alias: 'f',
    name: 'format',
    defaultOption: true,
    defaultValue: 'rgb',
    description: 'The output format of the color ([bold]{default:} rgb).',
    typeLabel: '[underline]{rgb|hex}'
  },
  {
    alias: 'h',
    name: 'help',
    description: 'Displays this documentation'
  },
  {
    alias: 'i',
    name: 'ids',
    multiple: true,
    typeLabel: '[underline]{palette_id}',
    description: `
      The space-separated ID(s) of the palettes you wish to convert.
      At least one ID is required.
    `.replace(/\s+/g, ' ').trim()
  },
  {
    name: 'output',
    alias: 'o',
    defaultValue: '_palette.scss',
    description: `
      The name of the file that is generated
      ([bold]{default:} _palette.scss).
    `.replace(/\s+/g, ' ').trim()
  }
]
