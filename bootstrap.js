const
log = require('@superhero/debug').log,
config = require('./config')

module.exports = (options) =>
{
  if('resource' in options)
  {
    log(`Bootstrap the resource dispatcher`)
    const Resource = require('.')

    for(key in options.resource)
      switch(key)
      {
        case 'origin' :
          log(`${key} set to:`, options.resource[key])
          config[key] = options.resource[key]
          break

        case 'contentTypeMapper' :
          log(`${key} extended to:`, options.resource[key])
          Object.assign(config[key], options.resource[key])
          break

        default:
          log('Ignoring to set invalid key:', key)
      }
  }
}
