const
log = require('@superhero/debug').log,
config = require('./config')

module.exports = (options) =>
{
  log(`Bootstrap the resource dispatcher`)
  const Resource = require('.')

  for(key in options)
    switch(key)
    {
      case 'directory' :
        log(`${key} set to:`, options[key])
        config[key] = options[key]
        break

      case 'contentTypeMapper' :
        log(`${key} extended to:`, options[key])
        Object.assign(config[key], options[key])
        break

      default:
        log('Ignoring to set invalid key:', key)
    }
}
