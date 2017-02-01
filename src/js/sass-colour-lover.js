import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import validOptions from './ValidOptions'

try {
  const options = commandLineArgs(validOptions)
  if (
    options.help === true ||
    options.ids === undefined ||
    options.ids.length < 1
  ) {
    throw new Error('HELP')
  }
  // Add each ID to a set so that there each one is unique
  // Initialize the count for processed palettes
  // For each of the provided IDs
    // Reset the palette object
    // Populate the palette object
    // Attempt to fetch the palette remotely
      // On push a simplified object to the palettes array
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
