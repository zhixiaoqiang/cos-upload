const chalk = require('chalk')
const execa = require('execa')
const bumpVersion = require('./bump-version')

;(async () => {
  console.log('publish start...')
  const isConfirm = await bumpVersion()
  console.warn(isConfirm)
  const stdio = { stdio: 'inherit' }
  if (isConfirm) {
    const version = process.env.VERSION

    await execa('yarn', ['release'], stdio)
    await execa('yarn', ['publish', '--tag', version], stdio)

    console.log(chalk.green('publish successful.'))
  }
})().catch((err) => {
  console.log(err)
  err.stderr && console.error(err.stderr)
  err.stdout && console.error(err.stdout)
  process.exit(1)
})
