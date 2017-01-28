import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import validOptions from './ValidOptions'

try {
  const options = commandLineArgs(validOptions)
  if (options.help === true || options.ids === undefined) {
    throw new Error('HELP')
  }
} catch (error) {
  const errorType = error.toString().replace('Error: ', '')
  let usage = ''
  switch (errorType) {
    default:
      usage = commandLineUsage([
        {
          header: 'sass-colour-lover',
          content: `
            Auto-magically populate Sass stylesheets with color palettes
            from COLOURLovers.com
          `.replace(/\s+/g, ' ').trim()
        },
        {
          header: 'Options',
          optionList: validOptions
        }
      ])
      break
  }
  console.log(usage)
}
