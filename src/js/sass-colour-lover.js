import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

const validOptions = [
  {name: 'help', alias: 'h', defaultOption: true},
  {name: 'output', alias: 'o', defaultValue: '_palette.scss'}
]

try {
  const options = commandLineArgs(validOptions)
  if (options.help === true) {
    throw new Error()
  }
} catch (error) {
  const usage = commandLineUsage([
    {
      header: 'sass-colour-lover',
      content: `
        Auto-magically populate Sass stylesheets with color palettes from
        COLOURLovers.com
      `
    }
  ])
  console.log(usage)
}
